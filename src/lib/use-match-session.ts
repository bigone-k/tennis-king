"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  applyScoreOp,
  emptySession,
  type MatchSession,
  type MatchSessionData,
  type ScoreOp,
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
  // Sent for shape compatibility only — the server keeps its own scores and
  // ignores this field. Score changes go through `changeScore` (PATCH).
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

/**
 * Re-apply this client's edits on top of whatever the server accepted first.
 *
 * `base` is the last state both sides agreed on, so anything that differs
 * between `base` and `local` is ours and gets replayed; everything else is
 * taken from the server. Without this a conflict silently discards whatever
 * the user just did.
 */
export const mergeLocalEdits = (
  server: MatchSession,
  base: MatchSessionData,
  local: MatchSession,
): MatchSessionData => {
  const localGuestIds = new Set(local.guests.map((g) => g.id));
  const baseGuestIds = new Set(base.guests.map((g) => g.id));
  const removedGuests = new Set(
    [...baseGuestIds].filter((id) => !localGuestIds.has(id)),
  );
  const addedGuests = local.guests.filter((g) => !baseGuestIds.has(g.id));

  const guests = [
    ...server.guests.filter((g) => !removedGuests.has(g.id)),
    ...addedGuests.filter((g) => !server.guests.some((s) => s.id === g.id)),
  ];

  const baseSelected = new Set(base.selectedIds);
  const localSelected = new Set(local.selectedIds);
  const deselected = new Set(
    [...baseSelected].filter((id) => !localSelected.has(id)),
  );
  const knownIds = new Set(guests.map((g) => g.id));
  const selectedIds = [
    ...new Set([
      ...server.selectedIds.filter((id) => !deselected.has(id)),
      ...[...localSelected].filter((id) => !baseSelected.has(id)),
    ]),
    // A guest removed by someone else must not stay selected.
  ].filter((id) => !id.startsWith("g-") || knownIds.has(id));

  return {
    guests,
    selectedIds,
    gamesPerPlayer:
      local.gamesPerPlayer !== base.gamesPerPlayer
        ? local.gamesPerPlayer
        : server.gamesPerPlayer,
    bracket: server.bracket,
    scores: server.scores,
  };
};

const sameData = (a: MatchSessionData, b: MatchSessionData): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

export function useMatchSession() {
  const [session, setSession] = useState<MatchSession>(emptySession);
  const [status, setStatus] = useState<SyncStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conflicted, setConflicted] = useState(false);
  const [pending, setPending] = useState(false);

  /* Refs mirror state so callbacks never close over a stale session. */
  const sessionRef = useRef<MatchSession>(session);
  /** Last state this client and the server agreed on — the merge base. */
  const lastSyncedRef = useRef<MatchSessionData>(toData(session));
  const dirtyRef = useRef(false);
  const inFlightRef = useRef(false);
  const failedRef = useRef(false);
  const flushTimerRef = useRef<number | undefined>(undefined);
  const lastActivityRef = useRef(Date.now());
  const startPollingRef = useRef<() => void>(() => {});
  /** Set once `flush` is defined; breaks the flush ⇄ scheduleFlush cycle. */
  const flushRef = useRef<() => Promise<void>>(async () => {});

  /**
   * Bumped by reset/generate. A response that comes back carrying an older
   * generation describes a session that no longer exists, so it is dropped
   * instead of repainting the screen with it.
   */
  const generationRef = useRef(0);

  /** Score taps not yet acknowledged by the server, in the order made. */
  const scoreQueueRef = useRef<ScoreOp[]>([]);
  const scoreSendingRef = useRef(false);
  const scoreRetryTimerRef = useRef<number | undefined>(undefined);
  const pumpScoresRef = useRef<() => Promise<void>>(async () => {});

  const applySession = useCallback((next: MatchSession) => {
    sessionRef.current = next;
    setSession(next);
  }, []);

  /**
   * Server state does not yet include taps still sitting in the queue, so
   * layer them back on before showing it — otherwise the number visibly
   * jumps backwards for a moment.
   */
  const withPendingScores = useCallback((s: MatchSession): MatchSession => {
    if (scoreQueueRef.current.length === 0) return s;
    let scores = s.scores;
    for (const op of scoreQueueRef.current) scores = applyScoreOp(scores, op);
    return { ...s, scores };
  }, []);

  /** Accept a server response as the new shared truth. */
  const acceptServer = useCallback(
    (next: MatchSession) => {
      lastSyncedRef.current = toData(next);
      applySession(withPendingScores(next));
    },
    [applySession, withPendingScores],
  );

  const clearFlushTimer = useCallback(() => {
    if (flushTimerRef.current !== undefined) {
      window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = undefined;
    }
  }, []);

  /** Poll. Skipped while local edits are unsaved so we never clobber input. */
  const fetchLatest = useCallback(async () => {
    if (dirtyRef.current || inFlightRef.current) return;
    const generation = generationRef.current;
    try {
      const response = await fetch(ENDPOINT, { cache: "no-store" });
      if (!response.ok) throw new Error(await errorText(response));
      const latest = (await response.json()) as MatchSession;
      // The user may have started editing while this request was in flight.
      if (dirtyRef.current || inFlightRef.current) return;
      if (generationRef.current !== generation) return;
      acceptServer(latest);
      setStatus("live");
      setErrorMessage(null);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "서버에 연결할 수 없습니다.",
      );
    }
  }, [acceptServer]);

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

    const generation = generationRef.current;
    const base = sessionRef.current;
    try {
      const response = await fetch(ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: base.version, state: toData(base) }),
      });

      if (generationRef.current !== generation) return;

      if (response.status === 409) {
        const body = (await response.json()) as { session: MatchSession };
        if (generationRef.current !== generation) return;

        const merged = mergeLocalEdits(
          body.session,
          lastSyncedRef.current,
          sessionRef.current,
        );
        lastSyncedRef.current = toData(body.session);
        applySession(withPendingScores({ ...body.session, ...merged }));
        // Anything of ours that survived the merge still has to be sent.
        dirtyRef.current = !sameData(merged, toData(body.session));
        setConflicted(true);
        failedRef.current = false;
        setStatus("live");
        setErrorMessage(null);
        return;
      }
      if (!response.ok) throw new Error(await errorText(response));

      const saved = (await response.json()) as MatchSession;
      if (generationRef.current !== generation) return;

      lastSyncedRef.current = toData(saved);
      if (dirtyRef.current) {
        // The user edited again while this request was in flight. Overwriting
        // with the server copy would erase that input, so keep the local state
        // and take only the new version — the queued flush sends it next.
        applySession({
          ...sessionRef.current,
          version: saved.version,
          updatedAt: saved.updatedAt,
        });
      } else {
        applySession(withPendingScores(saved));
      }
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
  }, [applySession, scheduleFlush, withPendingScores]);

  useEffect(() => {
    flushRef.current = flush;
  }, [flush]);

  /** Send queued edits immediately and wait for them to land. */
  const flushNow = useCallback(async () => {
    clearFlushTimer();
    await flushRef.current();
  }, [clearFlushTimer]);

  /**
   * Drain the score queue one operation at a time. Each request carries a
   * single change, so the server merges it into whatever is stored instead of
   * competing for a version — two people on different matches both win.
   */
  const pumpScores = useCallback(async () => {
    if (scoreSendingRef.current) return;
    scoreSendingRef.current = true;
    setPending(true);

    try {
      while (scoreQueueRef.current.length > 0) {
        const op = scoreQueueRef.current[0];
        const generation = generationRef.current;

        let response: Response;
        try {
          response = await fetch(ENDPOINT, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(op),
          });
        } catch {
          // Offline. Leave the tap queued and try again shortly.
          setStatus("error");
          setErrorMessage("점수를 저장하지 못했습니다. 다시 시도합니다.");
          scoreRetryTimerRef.current = window.setTimeout(() => {
            void pumpScoresRef.current();
          }, RETRY_DELAY_MS);
          return;
        }

        // Bracket was reset or regenerated — these taps target a gone match.
        if (generationRef.current !== generation) {
          scoreQueueRef.current = [];
          return;
        }

        if (!response.ok) {
          // A rejected change will never succeed on retry; drop it and say so
          // rather than looping forever or pretending it worked.
          scoreQueueRef.current.shift();
          setStatus("error");
          setErrorMessage(await errorText(response));
          continue;
        }

        const saved = (await response.json()) as MatchSession;
        scoreQueueRef.current.shift();
        if (generationRef.current !== generation) return;

        acceptServer(saved);
        setStatus("live");
        setErrorMessage(null);
      }
    } finally {
      scoreSendingRef.current = false;
      setPending(false);
    }
  }, [acceptServer]);

  useEffect(() => {
    pumpScoresRef.current = pumpScores;
  }, [pumpScores]);

  const markActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (status === "paused") {
      setStatus("live");
      startPollingRef.current();
    }
  }, [status]);

  const enqueueScore = useCallback(
    (op: ScoreOp) => {
      markActivity();
      scoreQueueRef.current.push(op);
      applySession({
        ...sessionRef.current,
        scores: applyScoreOp(sessionRef.current.scores, op),
      });
      void pumpScoresRef.current();
    },
    [applySession, markActivity],
  );

  const changeScore = useCallback(
    (match: number, team: "A" | "B", delta: number) =>
      enqueueScore({ match, team, delta }),
    [enqueueScore],
  );

  const resetScore = useCallback(
    (match: number) => enqueueScore({ match, reset: true }),
    [enqueueScore],
  );

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

    // Scores are wiped by generation; queued taps belong to the old bracket.
    generationRef.current += 1;
    scoreQueueRef.current = [];
    const generation = generationRef.current;

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: sessionRef.current.version }),
      });

      if (response.status === 409) {
        const body = (await response.json()) as { session: MatchSession };
        if (generationRef.current !== generation) return null;
        acceptServer(body.session);
        setConflicted(true);
        return null;
      }
      if (!response.ok) return await errorText(response);

      const saved = (await response.json()) as MatchSession;
      if (generationRef.current !== generation) return null;
      acceptServer(saved);
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
  }, [acceptServer, flushNow, markActivity]);

  const reset = useCallback(async () => {
    markActivity();
    // Drop queued edits — otherwise a pending write would resurrect the
    // bracket we are deleting. Bumping the generation also invalidates any
    // request already in flight, whose response would do the same.
    clearFlushTimer();
    dirtyRef.current = false;
    generationRef.current += 1;
    scoreQueueRef.current = [];
    const generation = generationRef.current;

    try {
      const response = await fetch(ENDPOINT, { method: "DELETE" });
      if (!response.ok) throw new Error(await errorText(response));
      const cleared = (await response.json()) as MatchSession;
      if (generationRef.current !== generation) return;
      acceptServer(cleared);
      setStatus("live");
      setErrorMessage(null);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "초기화에 실패했습니다.",
      );
    }
  }, [acceptServer, clearFlushTimer, markActivity]);

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

  /*
   * Leaving the page must not drop the last tap. `keepalive` lets these
   * requests outlive the document, which a normal fetch in a cleanup would
   * not — the browser cancels those before they reach the server.
   */
  useEffect(() => {
    const sendPending = () => {
      for (const op of scoreQueueRef.current) {
        void fetch(ENDPOINT, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(op),
          keepalive: true,
        }).catch(() => {});
      }
      scoreQueueRef.current = [];

      if (dirtyRef.current) {
        dirtyRef.current = false;
        void fetch(ENDPOINT, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            version: sessionRef.current.version,
            state: toData(sessionRef.current),
          }),
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener("pagehide", sendPending);
    return () => {
      window.removeEventListener("pagehide", sendPending);
      if (flushTimerRef.current !== undefined) {
        window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = undefined;
      }
      if (scoreRetryTimerRef.current !== undefined) {
        window.clearTimeout(scoreRetryTimerRef.current);
        scoreRetryTimerRef.current = undefined;
      }
      sendPending();
    };
  }, []);

  return {
    session,
    status,
    pending,
    errorMessage,
    conflicted,
    dismissConflict: useCallback(() => setConflicted(false), []),
    update,
    changeScore,
    resetScore,
    generate,
    reset,
    refresh: fetchLatest,
  };
}
