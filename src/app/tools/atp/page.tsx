import { redirect } from "next/navigation";
import { hasValidSession } from "@/lib/auth/session";
import { members } from "@/lib/data/members";
import {
  currentSeoulYear,
  readAtpRecords,
  yearStandings,
  yearsWithRecords,
  type AtpRecord,
  type AtpStanding,
} from "@/lib/atp";

/** Gold / silver / bronze styling, keyed by rank (ties share a colour). */
const PODIUM_STYLE: Record<
  1 | 2 | 3,
  {
    block: string;
    text: string;
    bar: string;
    tag: string;
  }
> = {
  1: {
    block: "from-amber-300 via-amber-400 to-amber-600",
    text: "text-amber-300",
    bar: "bg-amber-400",
    tag: "CHAMPION",
  },
  2: {
    block: "from-slate-200 via-slate-300 to-slate-500",
    text: "text-slate-200",
    bar: "bg-slate-400",
    tag: "RUNNER-UP",
  },
  3: {
    block: "from-orange-300 via-orange-400 to-orange-600",
    text: "text-orange-300",
    bar: "bg-orange-400",
    tag: "THIRD",
  },
};

const podiumStyle = (rank: number | null) =>
  rank !== null && rank <= 3 ? PODIUM_STYLE[rank as 1 | 2 | 3] : null;

const POINT_RULES = [
  { label: "1위", points: 250 },
  { label: "2위", points: 150 },
  { label: "3위", points: 90 },
  { label: "그 외", points: 30 },
];

export default async function AtpRankingPage() {
  // proxy.ts is only a pre-filter — check again where the data is read.
  if (!(await hasValidSession())) redirect("/gate?next=/tools/atp");

  let records: AtpRecord[];
  try {
    records = await readAtpRecords();
  } catch (e) {
    console.error("[atp]", e);
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
          ATP 순위
        </h1>
        <p className="card p-5 text-sm text-red-600">
          ATP 기록을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.
        </p>
      </div>
    );
  }

  const year = currentSeoulYear();
  const standings = yearStandings(records, year, members);
  const ranked = standings.filter((s) => s.rank !== null);
  const unranked = standings.filter((s) => s.rank === null);
  const leaderPoints = ranked[0]?.points ?? 0;
  const recordedDays = records.filter((r) => r.year === year).length;
  const seasons = yearsWithRecords(records);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ---------- Hero: season title, stats, podium ---------- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 border border-emerald-400/20 shadow-xl px-5 pt-7 pb-0 sm:px-8 sm:pt-9">
        <CourtLines />

        <div className="relative text-center">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.35em] text-emerald-300/70">
            NOAD TENNIS CLUB
          </p>
          <h1
            className="mt-2 text-4xl sm:text-5xl font-black tracking-[0.12em] text-amber-300"
            style={{
              textShadow:
                "0 0 24px rgba(251,191,36,0.55), 0 0 60px rgba(251,191,36,0.25)",
            }}
          >
            ATP RANKING
          </h1>
          <p className="mt-1 text-sm font-bold tracking-[0.3em] text-white/80">
            {year} SEASON
          </p>
        </div>

        <dl className="relative mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          <Stat label="기록한 경기일" value={`${recordedDays}회`} />
          <Stat label="랭킹 진입" value={`${ranked.length}명`} />
          <Stat label="선두 점수" value={`${leaderPoints}점`} />
        </dl>

        {ranked.length === 0 ? (
          <p className="relative py-12 text-center text-sm text-white/60 leading-relaxed">
            아직 {year}년에 기록된 점수가 없습니다.
            <br />
            대진표 생성기에서 경기 종료 후 &lsquo;ATP 점수 기록 생성&rsquo;을 눌러 주세요.
          </p>
        ) : (
          <Podium top={ranked.filter((s) => s.rank! <= 2)} />
        )}
      </section>

      {/* ---------- Point rules ---------- */}
      <section
        aria-label="점수 규칙"
        className="card grid grid-cols-4 divide-x divide-gray-100 overflow-hidden"
      >
        {POINT_RULES.map((r) => (
          <div key={r.label} className="py-3 text-center">
            <p className="text-[11px] font-semibold text-gray-400">{r.label}</p>
            <p className="mt-0.5 text-base font-black text-gray-900 tabular-nums">
              {r.points}
              <span className="ml-0.5 text-[11px] font-semibold text-gray-400">
                점
              </span>
            </p>
          </div>
        ))}
      </section>

      {/* ---------- Full standings ---------- */}
      <section>
        <SectionTitle eyebrow="STANDINGS" title={`${year}년 전체 순위`} />
        <div className="card overflow-hidden">
          <div className="flex items-center gap-4 px-5 py-2.5 bg-gray-50 text-[11px] font-bold tracking-wider text-gray-400">
            <span className="w-10 text-center">순위</span>
            <span className="flex-1">회원</span>
            <span className="w-12 text-right">참가</span>
            <span className="w-16 text-right">점수</span>
          </div>
          <ol className="divide-y divide-gray-100">
            {ranked.map((s, i) => (
              <StandingRow
                key={s.memberNo}
                standing={s}
                leaderPoints={leaderPoints}
                delayMs={i * 60}
              />
            ))}
          </ol>
          {unranked.length > 0 && (
            <>
              <p className="px-5 py-2 bg-gray-50 text-[11px] font-bold tracking-wider text-gray-400 border-t border-gray-100">
                아직 기록 없음 · {unranked.length}명
              </p>
              <ul className="divide-y divide-gray-100">
                {unranked.map((s) => (
                  <li
                    key={s.memberNo}
                    className="flex items-center gap-4 px-5 py-2.5 text-gray-400"
                  >
                    <span className="w-10 text-center">-</span>
                    <span className="flex-1 truncate">{s.name}</span>
                    <span className="w-12 text-right text-xs tabular-nums">
                      0회
                    </span>
                    <span className="w-16 text-right text-sm tabular-nums">
                      0점
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* ---------- Season history ---------- */}
      <section>
        <SectionTitle eyebrow="HALL OF FAME" title="역대 시즌 TOP 3" />
        {seasons.length === 0 ? (
          <p className="card p-5 text-sm text-gray-400">
            아직 기록된 ATP 점수가 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {seasons.map((y) => (
              <SeasonCard
                key={y}
                year={y}
                top={yearStandings(records, y, members).filter(
                  (s) => s.rank !== null && s.rank <= 3,
                )}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- Components ---------- */

/** Faint tennis-court lines behind the hero. Decorative only. */
function CourtLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
      <div className="absolute inset-x-6 inset-y-5 border-2 border-white rounded-sm" />
      <div className="absolute inset-x-6 top-1/2 border-t-2 border-white" />
      <div className="absolute left-1/2 inset-y-5 border-l-2 border-white" />
      <div className="absolute inset-x-16 inset-y-5 border-x-2 border-white" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 px-2 py-2.5 text-center">
      <dt className="text-[10px] sm:text-[11px] font-semibold text-emerald-200/60">
        {label}
      </dt>
      <dd className="mt-0.5 text-lg sm:text-xl font-black text-white tabular-nums">
        {value}
      </dd>
    </div>
  );
}

/**
 * Tennis awards a winner and a finalist only, so the podium shows ranks 1 and 2.
 * Picked by rank, not position: everyone tied for a place stands on it (two
 * co-champions, or a champion with two runners-up), one column each.
 */
function Podium({ top }: { top: AtpStanding[] }) {
  return (
    <div
      className={`relative mt-8 mx-auto grid gap-3 sm:gap-5 items-end ${
        top.length <= 2 ? "max-w-sm" : ""
      }`}
      style={{ gridTemplateColumns: `repeat(${Math.max(top.length, 2)}, minmax(0, 1fr))` }}
    >
      {top.map((entry) => (
        <PodiumSlot
          key={entry.memberNo}
          entry={entry}
          heightClass={entry.rank === 1 ? "h-28 sm:h-36" : "h-20 sm:h-24"}
          delayMs={entry.rank === 1 ? 300 : 0}
          isChampion={entry.rank === 1}
        />
      ))}
    </div>
  );
}

/** Champion: trophy in a gold ring. */
function TrophyBadge() {
  return (
    <div
      aria-hidden
      className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 ring-4 ring-amber-300 shadow-lg text-3xl sm:text-4xl"
    >
      🏆
    </div>
  );
}

/** Runner-up: a plain silver salver — outer rim, recessed well, faint centre ring. */
function SilverPlate() {
  return (
    <div
      aria-hidden
      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1.5 bg-gradient-to-br from-white via-slate-300 to-slate-500 shadow-lg shadow-black/40"
    >
      <div className="w-full h-full rounded-full p-2 bg-gradient-to-tl from-slate-100 via-slate-300 to-slate-400 shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]">
        <div className="w-full h-full rounded-full border border-white/70 bg-gradient-to-br from-slate-200 to-slate-400" />
      </div>
    </div>
  );
}

function PodiumSlot({
  entry,
  heightClass,
  delayMs,
  isChampion,
}: {
  entry: AtpStanding;
  heightClass: string;
  delayMs: number;
  isChampion: boolean;
}) {
  const style = podiumStyle(entry.rank)!;

  return (
    <div
      className="flex flex-col items-center min-w-0 animate-podium-rise motion-reduce:animate-none"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {isChampion ? <TrophyBadge /> : <SilverPlate />}
      <p className={`mt-2 text-[9px] sm:text-[10px] font-black tracking-widest ${style.text}`}>
        {style.tag}
      </p>
      <p
        className={`font-black text-white truncate max-w-full ${
          isChampion ? "text-lg sm:text-xl" : "text-sm sm:text-base"
        }`}
      >
        {entry.name}
      </p>
      <p className={`font-black tabular-nums ${style.text} ${isChampion ? "text-base" : "text-sm"}`}>
        {entry.points}점
      </p>
      <p className="text-[10px] text-white/50 tabular-nums">{entry.played}회 참가</p>

      <div
        className={`${heightClass} mt-2 w-full rounded-t-xl bg-gradient-to-b ${style.block} shadow-xl flex items-start justify-center pt-2`}
      >
        <span
          className={`font-black text-white/90 ${isChampion ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
        >
          {entry.rank}
        </span>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-3">
      <p className="text-[10px] font-bold tracking-[0.3em] text-emerald-600">
        {eyebrow}
      </p>
      <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
    </div>
  );
}

function StandingRow({
  standing: s,
  leaderPoints,
  delayMs,
}: {
  standing: AtpStanding;
  leaderPoints: number;
  delayMs: number;
}) {
  const style = podiumStyle(s.rank);
  const share = leaderPoints > 0 ? Math.round((s.points / leaderPoints) * 100) : 0;

  return (
    <li
      className="relative flex items-center gap-4 px-5 py-3 animate-rank-slide motion-reduce:animate-none"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {style && (
        <span aria-hidden className={`absolute left-0 inset-y-2 w-1 rounded-r ${style.bar}`} />
      )}
      <span
        className={`w-10 text-center text-gray-900 tabular-nums ${
          style ? "font-black" : "font-normal"
        }`}
      >
        {s.rank}위
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{s.name}</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full ${style ? style.bar : "bg-emerald-400"}`}
            style={{ width: `${share}%` }}
          />
        </div>
      </div>
      <span className="w-12 text-right text-xs text-gray-400 tabular-nums">
        {s.played}회
      </span>
      <span className="w-16 text-right font-bold text-emerald-600 tabular-nums">
        {s.points}점
      </span>
    </li>
  );
}

function SeasonCard({ year, top }: { year: number; top: AtpStanding[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-baseline justify-between px-5 pt-4 pb-3">
        <p className="text-2xl font-black text-gray-900 tabular-nums">{year}</p>
        <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400">SEASON</p>
      </div>
      {/* Ties can put more than three people in the top 3 — one column each. */}
      <ol
        className="grid border-t border-gray-100 divide-x divide-gray-100"
        style={{ gridTemplateColumns: `repeat(${top.length}, minmax(0, 1fr))` }}
      >
        {top.map((s) => {
          const style = podiumStyle(s.rank)!;
          return (
            <li key={s.memberNo} className="relative px-3 py-3 text-center min-w-0">
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${style.bar}`} />
              <p className="text-xs font-black text-gray-900">{s.rank}위</p>
              <p className="mt-1 font-semibold text-gray-900 truncate">{s.name}</p>
              <p className="text-xs font-bold text-emerald-600 tabular-nums">
                {s.points}점
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
