"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  emptySession,
  type MatchSession,
  type MatchSessionData,
} from "./match-session";

const ENDPOINT = "/api/match-session";

/** Confirmed with the club: 10s auto-refresh (see docs/DEV-PLAN.md §5.5). */
const POLL_INTERVAL_MS = 10_000;
/** Coalesce rapid edits (score +/- taps) into one write. */
const WRITE_DEBOUNCE_MS = 400;
const RETRY_DELAY_MS = 5_000;
/** Stop polling for a tab left open and untouched. */
const IDLE_TIMEOUT_MS = 5 * 60_000;

export type SyncStatus = "loading" | "live" | "paused" | "error";

const toData = (session: MatchSession): MatchSessionData => ({
  guests: session.guests,
  selectedIds: session.selectedIds,
  gamesPerPlayer: session.gamesPerPlayer,
  bracket: session.bracket,
  scores: session.scores,
});

const errorText = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? `요청 실패 (${response.status})`;
  } catch {
    return `요청 실패 (${response.status})`;
  }
};

export function useMatchSession() {
  const [session, setSession] = useState<MatchSession>(emptySession);
  const [status, setStatus] = useState<SyncStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conflicted, setConflicted] = useState(false);
  const [pending, setPending] = useState(false);

  /* Refs mirror state so callbacks never close over a stale session. */
  const sessionRef = useRef<MatchSession>(session);
  const dirtyRef = useRef(false);
  const inFlightRef = useRef(false);
  const failedRef = useRef(false);
  const flushTimerRef = useRef<number | undefined>(undefined);
  const lastActivityRef = useRef(Date.now());
  const startPollingRef = useRef<() => void>(() => {});
  /** Set once `flush` is defined; breaks the flush ⇄ scheduleFlush cycle. */
  const flushRef = useRef<() => Promise<void>>(async () => {});

  const applySession = useCallback((next: MatchSession) => {
    sessionRef.current = next;
    setSession(next);
  }, []);

  const clearFlushTimer = useCallback(() => {
    if (flushTimerRef.current !== undefined) {
      window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = undefined;
    }
  }, []);

  /** Poll. Skipped while local edits are unsaved so we never clobber input. */
  const fetchLatest = useCallback(async () => {
    if (dirtyRef.current || inFlightRef.current) return;
    try {
      const response = await fetch(ENDPOINT, { cache: "no-store" });
      if (!response.ok) throw new Error(await errorText(response));
      const latest = (await response.json()) as MatchSession;
      // The user may have started editing while this request was in flight.
      if (dirtyRef.current || inFlightRef.current) return;
      applySession(latest);
      setStatus("live");
      setErrorMessage(null);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "서버에 연결할 수 없습니다.",
      );
    }
  }, [applySession]);

  const scheduleFlush = useCallback((delay = WRITE_DEBOUNCE_MS) => {
    clearFlushTimer();
    flushTimerRef.current = window.setTimeout(() => {
      flushTimerRef.current = undefined;
      void flushRef.current();
    }, delay);
  }, [clearFlushTimer]);

  const flush = useCallback(async () => {
    if (inFlightRef.current || !dirtyRef.current) return;

    inFlightRef.current = true;
    dirtyRef.current = false;
    setPending(true);

    const base = sessionRef.current;
    try {
      const response = await fetch(ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: base.version, state: toData(base) }),
      });

      if (response.status === 409) {
        const body = (await response.json()) as { session: MatchSession };
        applySession(body.session);
        setConflicted(true);
        failedRef.current = false;
        setStatus("live");
        setErrorMessage(null);
        return;
      }
      if (!response.ok) throw new Error(await errorText(response));

      applySession((await response.json()) as MatchSession);
      failedRef.current = false;
      setStatus("live");
      setErrorMessage(null);
    } catch (error) {
      // Keep the edit queued and retry — a dropped connection should not
      // silently discard someone's score entry.
      dirtyRef.current = true;
      failedRef.current = true;
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "저장에 실패했습니다.",
      );
    } finally {
      inFlightRef.current = false;
      setPending(false);
      if (dirtyRef.current) {
        // Back off after a failure so a dead connection isn't hammered.
        scheduleFlush(failedRef.current ? RETRY_DELAY_MS : WRITE_DEBOUNCE_MS);
      }
    }
  }, [applySession, scheduleFlush]);

  useEffect(() => {
    flushRef.current = flush;
  }, [flush]);

  /** Send queued edits immediately and wait for them to land. */
  const flushNow = useCallback(async () => {
    clearFlushTimer();
    await flushRef.current();
  }, [clearFlushTimer]);

  const markActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (status === "paused") {
      setStatus("live");
      startPollingRef.current();
    }
  }, [status]);

  /**
   * Optimistic local edit, persisted on a short debounce.
   *
   * Pass a function whenever the new value depends on the old one. Rendered
   * state lags behind rapid input (tapping six players, or "+" five times in
   * a row), so deriving from it would drop all but the last edit; the updater
   * form reads the ref, which is always current.
   */
  const update = useCallback(
    (
      patch:
        | Partial<MatchSessionData>
        | ((current: MatchSession) => Partial<MatchSessionData>),
    ) => {
      markActivity();
      const base = sessionRef.current;
      const resolved = typeof patch === "function" ? patch(base) : patch;
      applySession({ ...base, ...resolved });
      dirtyRef.current = true;
      scheduleFlush();
    },
    [applySession, markActivity, scheduleFlush],
  );

  /** Bracket generation runs on the server so everyone gets the same draw. */
  const generate = useCallback(async (): Promise<string | null> => {
    markActivity();
    await flushNow();

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: sessionRef.current.version }),
      });

      if (response.status === 409) {
        const body = (await response.json()) as { session: MatchSession };
        applySession(body.session);
        setConflicted(true);
        return null;
      }
      if (!response.ok) return await errorText(response);

      applySession((await response.json()) as MatchSession);
      setStatus("live");
      setErrorMessage(null);
      return null;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "대진표 생성에 실패했습니다.";
      setStatus("error");
      setErrorMessage(message);
      return message;
    }
  }, [applySession, flushNow, markActivity]);

  const reset = useCallback(async () => {
    markActivity();
    // Drop queued edits — otherwise a pending write would resurrect the
    // bracket we are deleting.
    clearFlushTimer();
    dirtyRef.current = false;

    try {
      const response = await fetch(ENDPOINT, { method: "DELETE" });
      if (!response.ok) throw new Error(await errorText(response));
      applySession((await response.json()) as MatchSession);
      setStatus("live");
      setErrorMessage(null);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "초기화에 실패했습니다.",
      );
    }
  }, [applySession, clearFlushTimer, markActivity]);

  /* Polling: immediate on mount and on tab return, paused when hidden/idle. */
  useEffect(() => {
    let timer: number | undefined;

    const stop = () => {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => {
        if (Date.now() - lastActivityRef.current > IDLE_TIMEOUT_MS) {
          stop();
          setStatus("paused");
          return;
        }
        void fetchLatest();
      }, POLL_INTERVAL_MS);
    };

    startPollingRef.current = start;

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Returning to the page is the moment results matter most — refresh
        // without waiting out the interval.
        lastActivityRef.current = Date.now();
        setStatus((prev) => (prev === "paused" ? "live" : prev));
        void fetchLatest();
        start();
      } else {
        stop();
      }
    };

    void fetchLatest();
    start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [fetchLatest]);

  /* Flush anything still queued when leaving the page. */
  useEffect(() => () => clearFlushTimer(), [clearFlushTimer]);

  return {
    session,
    status,
    pending,
    errorMessage,
    conflicted,
    dismissConflict: useCallback(() => setConflicted(false), []),
    update,
    generate,
    reset,
    refresh: fetchLatest,
  };
}
