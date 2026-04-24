"use client";

import { useEffect, useMemo, useState } from "react";
import { members, type Gender } from "@/data/members";
import {
  adjustGamesPerPlayer,
  generateBracket,
  type BracketResult,
  type Match,
  type Player,
} from "@/lib/match-maker";

type Winner = "A" | "B" | null;

interface MatchScore {
  scoreA: number;
  scoreB: number;
}

const getWinner = (s?: MatchScore): Winner => {
  if (!s) return null;
  if (s.scoreA > s.scoreB) return "A";
  if (s.scoreB > s.scoreA) return "B";
  return null;
};

const STORAGE_KEY = "tennis-king:match-maker:v1";

interface PersistedState {
  guests: Player[];
  selectedIds: string[];
  gamesPerPlayer: number;
  bracket: BracketResult | null;
  scores: Record<number, MatchScore>;
}

export default function MatchMakerPage() {
  const memberPlayers = useMemo<Player[]>(
    () =>
      members.map((m) => ({
        id: `m-${m.no}`,
        name: m.name,
        gender: m.gender,
      })),
    [],
  );

  const [guests, setGuests] = useState<Player[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [gamesPerPlayer, setGamesPerPlayer] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bracket, setBracket] = useState<BracketResult | null>(null);
  const [scores, setScores] = useState<Record<number, MatchScore>>({});
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestGender, setGuestGender] = useState<Gender>("M");
  const [hydrated, setHydrated] = useState(false);

  /* --- localStorage hydration (on mount) ---
   *  Reads a snapshot from browser storage once after mount. Deferred via
   *  queueMicrotask so React doesn't flag synchronous setState in an effect;
   *  the rule wants useSyncExternalStore but our usage is read-once, not a
   *  live subscription. */
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw) as Partial<PersistedState>;
          if (Array.isArray(data.guests)) setGuests(data.guests);
          if (Array.isArray(data.selectedIds))
            setSelectedIds(new Set(data.selectedIds));
          if (typeof data.gamesPerPlayer === "number")
            setGamesPerPlayer(data.gamesPerPlayer);
          if (data.bracket) setBracket(data.bracket);
          if (data.scores && typeof data.scores === "object")
            setScores(data.scores);
        }
      } catch {
        /* ignore malformed storage */
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* --- localStorage persistence --- */
  useEffect(() => {
    if (!hydrated) return;
    try {
      const data: PersistedState = {
        guests,
        selectedIds: [...selectedIds],
        gamesPerPlayer,
        bracket,
        scores,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* quota/serialization errors ignored */
    }
  }, [hydrated, guests, selectedIds, gamesPerPlayer, bracket, scores]);

  const allPlayers = useMemo(
    () => [...memberPlayers, ...guests],
    [memberPlayers, guests],
  );
  const selectedPlayers = useMemo(
    () => allPlayers.filter((p) => selectedIds.has(p.id)),
    [allPlayers, selectedIds],
  );

  const genderCount = {
    M: selectedPlayers.filter((p) => p.gender === "M").length,
    F: selectedPlayers.filter((p) => p.gender === "F").length,
  };
  const adjustedGames = adjustGamesPerPlayer(
    selectedPlayers.length,
    gamesPerPlayer,
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addGuest = () => {
    const name = guestName.trim();
    if (!name) return;
    const id = `g-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const guest: Player = { id, name, gender: guestGender, isGuest: true };
    setGuests((prev) => [...prev, guest]);
    setSelectedIds((prev) => new Set(prev).add(id));
    setGuestName("");
    setShowGuestForm(false);
  };

  const removeGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const selectAll = () =>
    setSelectedIds(new Set(allPlayers.map((p) => p.id)));
  const clearAll = () => setSelectedIds(new Set());

  const resetBracket = () => {
    if (!bracket) return;
    const ok = window.confirm(
      "현재 대진표와 점수를 초기화합니다. 계속하시겠습니까?",
    );
    if (!ok) return;
    setBracket(null);
    setScores({});
  };

  const hasBracket = bracket !== null && bracket.matches.length > 0;
  const canGenerate =
    selectedPlayers.length >= 4 && !isGenerating && !hasBracket;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setBracket(null);
    setScores({});
    setIsGenerating(true);
    window.setTimeout(() => {
      const result = generateBracket(selectedPlayers, gamesPerPlayer);
      setBracket(result);
      setIsGenerating(false);
    }, 2200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-16">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          대진표 생성기
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          공정한 랜덤 복식 대진표를 자동으로 생성합니다.
        </p>
      </header>

      {/* 1. Participants */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            1. 참가 인원 선택
          </h2>
          <span className="text-xs text-gray-400">
            선택 <b className="text-emerald-600">{selectedPlayers.length}명</b>{" "}
            · 남 {genderCount.M} / 여 {genderCount.F}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium"
          >
            전체 선택
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium"
          >
            전체 해제
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {allPlayers.map((p) => {
            const selected = selectedIds.has(p.id);
            return (
              <div
                key={p.id}
                className={`relative bg-white rounded-2xl p-3 pr-9 flex items-center gap-3 cursor-pointer transition-all select-none border-2 ${
                  selected
                    ? "border-emerald-500 shadow-md shadow-emerald-500/15 -translate-y-0.5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleSelect(p.id)}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                    p.gender === "M" ? "bg-emerald-500" : "bg-teal-400"
                  }`}
                >
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      selected ? "text-emerald-700" : "text-gray-900"
                    }`}
                  >
                    {p.name}
                    {p.isGuest && (
                      <span className="text-[10px] ml-1 font-medium text-amber-600">
                        게스트
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {p.gender === "M" ? "남" : "여"}
                  </p>
                </div>

                {/* 선택 상태 뱃지 */}
                <span
                  className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                    selected
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-300"
                  }`}
                  aria-hidden
                >
                  {selected ? "✓" : ""}
                </span>

                {p.isGuest && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGuest(p.id);
                    }}
                    className="absolute bottom-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
                    aria-label="게스트 삭제"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}

          {!showGuestForm && (
            <button
              onClick={() => setShowGuestForm(true)}
              className="p-3 flex items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 font-semibold text-sm"
            >
              + 게스트 추가
            </button>
          )}
        </div>

        {showGuestForm && (
          <div className="card p-3 flex items-center gap-2">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGuest()}
              placeholder="게스트 이름"
              autoFocus
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500"
            />
            <select
              value={guestGender}
              onChange={(e) => setGuestGender(e.target.value as Gender)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white"
            >
              <option value="M">남</option>
              <option value="F">여</option>
            </select>
            <button
              onClick={addGuest}
              className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600"
            >
              추가
            </button>
            <button
              onClick={() => {
                setShowGuestForm(false);
                setGuestName("");
              }}
              className="px-2 py-2 text-sm text-gray-400 hover:text-gray-600"
            >
              취소
            </button>
          </div>
        )}
      </section>

      {/* 2. Games per player */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">
          2. 인원별 참가 게임 횟수
        </h2>
        <div className="card p-4 flex items-center gap-4">
          <button
            onClick={() => setGamesPerPlayer((v) => Math.max(1, v - 1))}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-xl font-bold text-gray-700"
            aria-label="게임 수 감소"
          >
            −
          </button>
          <div className="flex-1 text-center">
            <p className="text-4xl font-extrabold text-emerald-600 leading-none">
              {gamesPerPlayer}
            </p>
            <p className="text-xs text-gray-400 mt-1">게임 / 1인</p>
          </div>
          <button
            onClick={() => setGamesPerPlayer((v) => Math.min(20, v + 1))}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-xl font-bold text-gray-700"
            aria-label="게임 수 증가"
          >
            +
          </button>
        </div>
        {selectedPlayers.length >= 4 &&
          adjustedGames !== gamesPerPlayer &&
          adjustedGames > 0 && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 p-3 rounded-lg leading-relaxed">
              ⚠ 참가 {selectedPlayers.length}명 × {gamesPerPlayer}게임은 복식(4인)
              조건을 만족하지 않습니다. 실제 생성 시{" "}
              <b>각 {adjustedGames}게임</b>으로 조정됩니다.
            </p>
          )}
      </section>

      {/* 3. Generate */}
      <section className="space-y-2">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="relative w-full py-6 rounded-2xl overflow-hidden font-black text-lg tracking-wider text-white shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-transform active:scale-[0.98] group"
          style={{
            background: hasBracket
              ? "linear-gradient(120deg, #6b7280 0%, #9ca3af 100%)"
              : "linear-gradient(120deg, #065f46 0%, #10b981 40%, #84cc16 100%)",
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {hasBracket ? (
              <>
                <span className="text-2xl">🔒</span>
                대진표 생성됨
              </>
            ) : (
              <>
                <span className="text-2xl">🎾</span>
                랜덤 대진표 생성
                <span className="text-2xl">⚡</span>
              </>
            )}
          </span>
          {!hasBracket && (
            <span className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine pointer-events-none" />
          )}
        </button>
        {hasBracket ? (
          <p className="text-xs text-center text-gray-400">
            새 대진표를 만들려면 아래{" "}
            <b className="text-red-500">🗑 초기화</b>를 먼저 눌러주세요.
          </p>
        ) : selectedPlayers.length < 4 ? (
          <p className="text-xs text-center text-gray-400">
            최소 4명 이상의 참가자를 선택하세요.
          </p>
        ) : null}
      </section>

      {/* 4. Results */}
      {bracket && bracket.matches.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-gray-900">
              대진표{" "}
              <span className="text-emerald-600">
                총 {bracket.matches.length}경기
              </span>
            </h2>
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-gray-400">
                각 {bracket.gamesPerPlayer}게임 플레이
              </span>
              <button
                onClick={resetBracket}
                className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline"
              >
                🗑 초기화
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {bracket.matches.map((m, i) => (
              <MatchCard
                key={m.index}
                match={m}
                score={scores[m.index]}
                onChangeScore={(team, delta) =>
                  setScores((prev) => {
                    const cur = prev[m.index] ?? { scoreA: 0, scoreB: 0 };
                    return {
                      ...prev,
                      [m.index]: {
                        scoreA:
                          team === "A"
                            ? Math.max(0, cur.scoreA + delta)
                            : cur.scoreA,
                        scoreB:
                          team === "B"
                            ? Math.max(0, cur.scoreB + delta)
                            : cur.scoreB,
                      },
                    };
                  })
                }
                onResetScore={() =>
                  setScores((prev) => {
                    const next = { ...prev };
                    delete next[m.index];
                    return next;
                  })
                }
                revealDelayMs={i * 140}
              />
            ))}
          </div>

          <MatchSummary bracket={bracket} scores={scores} />
        </section>
      )}

      {bracket && bracket.matches.length === 0 && (
        <p className="text-sm text-center text-amber-700 bg-amber-50 p-4 rounded-xl">
          현재 조건으로는 대진표를 생성할 수 없습니다. 인원 또는 게임 수를 조정해
          주세요.
        </p>
      )}

      {isGenerating && <GenerationOverlay players={selectedPlayers} />}
    </div>
  );
}

/* ---------- Components ---------- */

interface MatchCardProps {
  match: Match;
  score: MatchScore | undefined;
  onChangeScore: (team: "A" | "B", delta: number) => void;
  onResetScore: () => void;
  revealDelayMs: number;
}

function MatchCard({
  match,
  score,
  onChangeScore,
  onResetScore,
  revealDelayMs,
}: MatchCardProps) {
  const scoreA = score?.scoreA ?? 0;
  const scoreB = score?.scoreB ?? 0;
  const hasScore = score !== undefined;
  const winner = getWinner(score);
  const aWin = winner === "A";
  const bWin = winner === "B";

  return (
    <div
      className="card p-4 animate-match-reveal"
      style={{ animationDelay: `${revealDelayMs}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-lime-500 px-3 py-1 rounded-full tracking-wider">
          {match.index}경기
        </span>
        <div className="flex items-center gap-2">
          {winner && (
            <span className="text-[11px] font-bold text-emerald-600">
              🏆 팀 {winner} 승
            </span>
          )}
          {hasScore && (
            <button
              onClick={onResetScore}
              className="text-[10px] text-gray-400 hover:text-red-500 underline"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-stretch">
        <TeamPanel
          label="A"
          players={match.teamA.players}
          state={aWin ? "win" : bWin ? "lose" : "neutral"}
        />
        <div className="flex items-center justify-center">
          <span className="text-gray-300 font-black text-sm">VS</span>
        </div>
        <TeamPanel
          label="B"
          players={match.teamB.players}
          state={bWin ? "win" : aWin ? "lose" : "neutral"}
        />
      </div>

      {/* 승점 기록 */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center mt-3">
        <ScoreBox
          value={scoreA}
          onDec={() => onChangeScore("A", -1)}
          onInc={() => onChangeScore("A", 1)}
          state={aWin ? "win" : bWin ? "lose" : "neutral"}
        />
        <span className="text-gray-300 font-black text-lg text-center">:</span>
        <ScoreBox
          value={scoreB}
          onDec={() => onChangeScore("B", -1)}
          onInc={() => onChangeScore("B", 1)}
          state={bWin ? "win" : aWin ? "lose" : "neutral"}
        />
      </div>
    </div>
  );
}

function ScoreBox({
  value,
  onDec,
  onInc,
  state,
}: {
  value: number;
  onDec: () => void;
  onInc: () => void;
  state: "win" | "lose" | "neutral";
}) {
  const bg =
    state === "win"
      ? "bg-emerald-500 text-white ring-2 ring-emerald-500"
      : state === "lose"
        ? "bg-gray-50 text-gray-400"
        : "bg-gray-50 text-gray-800";
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-2 py-1.5 transition-all ${bg}`}
    >
      <button
        onClick={onDec}
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold transition-colors ${
          state === "win"
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-white text-gray-500 hover:bg-gray-100"
        }`}
        aria-label="점수 감소"
      >
        −
      </button>
      <span className="min-w-[2rem] text-center text-2xl font-black tabular-nums">
        {value}
      </span>
      <button
        onClick={onInc}
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold transition-colors ${
          state === "win"
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-white text-gray-500 hover:bg-gray-100"
        }`}
        aria-label="점수 증가"
      >
        +
      </button>
    </div>
  );
}

function TeamPanel({
  label,
  players,
  state,
}: {
  label: string;
  players: readonly Player[];
  state: "win" | "lose" | "neutral";
}) {
  const ring =
    state === "win"
      ? "ring-2 ring-emerald-500 bg-emerald-50"
      : state === "lose"
        ? "opacity-50"
        : "bg-gray-50";
  return (
    <div className={`rounded-xl p-3 ${ring} transition-all`}>
      <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1.5">
        TEAM {label}
      </p>
      <div className="space-y-1">
        {players.map((p) => (
          <div key={p.id} className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                p.gender === "M" ? "bg-emerald-500" : "bg-teal-400"
              }`}
            />
            <span className="text-sm font-semibold text-gray-800">
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchSummary({
  bracket,
  scores,
}: {
  bracket: BracketResult;
  scores: Record<number, MatchScore>;
}) {
  interface Tally {
    name: string;
    wins: number;
    losses: number;
    pointsFor: number;
    pointsAgainst: number;
  }
  const tallies: Record<string, Tally> = {};
  const init = (p: Player) => {
    tallies[p.id] ??= {
      name: p.name,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    };
  };

  for (const m of bracket.matches) {
    for (const p of m.teamA.players) init(p);
    for (const p of m.teamB.players) init(p);

    const s = scores[m.index];
    if (!s) continue;

    for (const p of m.teamA.players) {
      tallies[p.id].pointsFor += s.scoreA;
      tallies[p.id].pointsAgainst += s.scoreB;
    }
    for (const p of m.teamB.players) {
      tallies[p.id].pointsFor += s.scoreB;
      tallies[p.id].pointsAgainst += s.scoreA;
    }

    const w = getWinner(s);
    if (!w) continue;
    const winTeam = w === "A" ? m.teamA.players : m.teamB.players;
    const loseTeam = w === "A" ? m.teamB.players : m.teamA.players;
    for (const p of winTeam) tallies[p.id].wins += 1;
    for (const p of loseTeam) tallies[p.id].losses += 1;
  }

  const ranked = Object.values(tallies).sort((a, b) => {
    // 1) 득실차 높은 순
    const pdA = a.pointsFor - a.pointsAgainst;
    const pdB = b.pointsFor - b.pointsAgainst;
    if (pdB !== pdA) return pdB - pdA;
    // 2) 승-패 차이 높은 순
    const wdA = a.wins - a.losses;
    const wdB = b.wins - b.losses;
    if (wdB !== wdA) return wdB - wdA;
    // 3) 득점+실점 큰 순
    return (
      b.pointsFor + b.pointsAgainst - (a.pointsFor + a.pointsAgainst)
    );
  });

  return (
    <div className="card p-4 mt-6">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-sm font-bold text-gray-900">전적 · 승점 요약</p>
        <p className="text-[10px] text-gray-400">승 · 패 · 득점-실점 (득실차)</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ranked.map((t, idx) => {
          const diff = t.pointsFor - t.pointsAgainst;
          const diffColor =
            diff > 0
              ? "text-emerald-600"
              : diff < 0
                ? "text-red-500"
                : "text-gray-400";
          return (
            <div
              key={t.name}
              className="flex items-center justify-between text-sm px-3 py-2 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black w-5 text-center ${
                    idx === 0
                      ? "text-amber-500"
                      : idx === 1
                        ? "text-gray-400"
                        : idx === 2
                          ? "text-orange-400"
                          : "text-gray-300"
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="font-semibold text-gray-800">{t.name}</span>
              </div>
              <span className="text-xs text-gray-500 tabular-nums">
                <b className="text-emerald-600">{t.wins}</b>승{" "}
                <b className="text-gray-500">{t.losses}</b>패{" · "}
                <b className="text-gray-700">{t.pointsFor}</b>
                {"-"}
                <b className="text-gray-700">{t.pointsAgainst}</b>{" "}
                <span className={diffColor}>
                  ({diff > 0 ? "+" : ""}
                  {diff})
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GenerationOverlay({ players }: { players: Player[] }) {
  const [showing, setShowing] = useState<Player[]>(() => players.slice(0, 4));

  useEffect(() => {
    const pickFour = () => {
      const pool = [...players];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return pool.slice(0, 4);
    };
    const id = window.setInterval(() => setShowing(pickFour()), 140);
    return () => window.clearInterval(id);
  }, [players]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-overlay-fade">
      <div className="text-center px-6">
        <div className="relative inline-block mb-6">
          <span className="block text-7xl animate-ball-spin">🎾</span>
          <span className="absolute inset-0 text-7xl animate-ball-ping">
            🎾
          </span>
        </div>

        <h3 className="text-4xl font-black text-lime-300 tracking-widest mb-2 animate-title-glow">
          DRAWING...
        </h3>
        <p className="text-sm text-emerald-200/80 mb-8 tracking-wider">
          공정한 대진표를 추첨 중입니다
        </p>

        <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
          {showing.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="animate-name-slot px-4 py-2 rounded-lg border border-emerald-400/40 bg-emerald-600/20 text-white text-sm font-bold"
            >
              {p.name}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-lime-300 animate-ball-ping"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
