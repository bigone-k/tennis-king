import Image from "next/image";
import type { ReactNode } from "react";

const pointRules = [
  { label: "1위", points: 250 },
  { label: "2위", points: 150 },
  { label: "3위", points: 90 },
  { label: "그 외", points: 30 },
];

const recordErrors = [
  {
    message: "이미 ATP 점수가 기록된 대진표입니다.",
    action: "이 대진표는 이미 기록되었습니다. 다시 누르지 않아도 됩니다.",
  },
  {
    message: "점수가 입력된 경기가 없어 ATP 점수를 기록할 수 없습니다.",
    action: "경기 점수를 먼저 입력한 뒤 다시 기록합니다.",
  },
  {
    message: "화면의 대진표가 최신이 아닙니다.",
    action: "다른 분이 대진표를 새로 만들었습니다. 새로고침한 뒤 확인합니다.",
  },
];

function SectionTitle({ no, children }: { no: number; children: ReactNode }) {
  return (
    <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
      <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
        {no}
      </span>
      {children}
    </h3>
  );
}

function Step({ no, children }: { no: number; children: ReactNode }) {
  return (
    <p className="flex gap-2 text-sm text-gray-700 leading-relaxed">
      <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center justify-center">
        {no}
      </span>
      <span>{children}</span>
    </p>
  );
}

function Shot({
  src,
  width,
  height,
  alt,
  caption,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="max-w-sm mx-auto">
      <Image
        src={`/notices/atp/${src}`}
        width={width}
        height={height}
        alt={alt}
        sizes="(max-width: 640px) 100vw, 384px"
        className="w-full h-auto rounded-xl border border-gray-200 shadow-sm"
      />
      {caption && (
        <figcaption className="text-xs text-gray-400 text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default function Notice11Content() {
  return (
    <div className="space-y-10">
      {/* 헤더 배너 */}
      <div className="bg-emerald-900 rounded-2xl p-6 md:p-8 text-white text-center">
        <p className="text-xs font-medium mb-2 text-emerald-300 uppercase tracking-widest">
          유용한기능 · 신규 기능
        </p>
        <h2 className="text-lg md:text-2xl font-extrabold tracking-tight">
          ATP 점수 기록 기능 안내
        </h2>
        <p className="text-sm text-white/60 mt-2">
          경기 결과를 ATP 점수로 남기고, 연도별 순위를 확인할 수 있습니다
        </p>
      </div>

      {/* 1. 점수 규칙 */}
      <section>
        <SectionTitle no={1}>ATP 점수 규칙</SectionTitle>
        <div className="card grid grid-cols-4 divide-x divide-gray-100 overflow-hidden mb-4">
          {pointRules.map((r) => (
            <div key={r.label} className="py-3 text-center">
              <p className="text-[11px] font-semibold text-gray-400">{r.label}</p>
              <p className="mt-0.5 text-base font-black text-gray-900">
                {r.points}
                <span className="ml-0.5 text-[11px] font-semibold text-gray-400">점</span>
              </p>
            </div>
          ))}
        </div>
        <ul className="space-y-2 text-sm text-gray-700 leading-relaxed list-disc pl-5">
          <li>
            순위는 대진표 생성기의 <b>최종 순위 발표 화면과 같은 순서</b>입니다.
          </li>
          <li>
            점수는 <b>정회원에게만</b> 쌓입니다. 게스트는 기록되지 않지만 순위 자리는
            차지합니다. 예를 들어 게스트가 1위이면, 2위 회원은 150점을 받습니다.
          </li>
          <li>
            대진표 <b>1개당 한 번만</b> 기록할 수 있습니다. 같은 대진표를 두 번 기록하면
            에러 메시지가 나옵니다.
          </li>
          <li>
            점수가 들어가는 연도는 <b>대진표를 만든 시각(한국 시간)</b>으로 정합니다.
            12월 31일에 만든 대진표를 1월 1일에 기록해도 12월이 속한 해의 점수가 됩니다.
          </li>
        </ul>
      </section>

      {/* 2. 기록하기 */}
      <section>
        <SectionTitle no={2}>ATP 점수 기록하기</SectionTitle>
        <div className="space-y-6">
          <div className="space-y-2">
            <Step no={1}>
              <b>유용한기능 → 대진표 생성기</b>에서 대진표를 만들고 경기 점수를 입력합니다.
            </Step>
            <Step no={2}>
              경기가 모두 끝나면 맨 아래 <b>&lsquo;경기 종료 · 최종 순위 발표&rsquo;</b>를
              누릅니다.
            </Step>
          </div>
          <Shot
            src="02-final-button.png"
            width={764}
            height={200}
            alt="대진표 하단의 경기 종료 · 최종 순위 발표 버튼"
          />

          <Step no={3}>
            최종 순위 화면 아래쪽, <b>&lsquo;닫기&rsquo; 버튼 옆</b>에 ATP 버튼 두 개가
            있습니다. 순위를 확인한 뒤 <b>&lsquo;ATP 점수 기록 생성&rsquo;</b>을 누릅니다.
          </Step>
          <Shot
            src="03-final-modal.png"
            width={716}
            height={1706}
            alt="최종 순위 발표 화면과 ATP 점수 기록 생성·삭제 버튼"
            caption="최종 순위 화면 (예시 데이터)"
          />

          <Step no={4}>
            초록색 <b>&lsquo;ATP 점수를 기록했습니다.&rsquo;</b>가 나오면 완료입니다.
          </Step>
          <Shot
            src="04-record-success.png"
            width={680}
            height={316}
            alt="ATP 점수를 기록했습니다 메시지"
            caption="기록 성공"
          />

          <div>
            <p className="font-bold text-gray-900 text-sm mb-3">
              빨간 메시지가 나올 때
            </p>
            <div className="space-y-2 mb-4">
              {recordErrors.map((e) => (
                <div key={e.message} className="card p-4 border-l-[3px] border-rose-400">
                  <p className="text-sm font-bold text-rose-600">{e.message}</p>
                  <p className="text-sm text-gray-600 mt-1">{e.action}</p>
                </div>
              ))}
            </div>
            <Shot
              src="05-record-duplicate.png"
              width={680}
              height={356}
              alt="이미 ATP 점수가 기록된 대진표입니다 에러 메시지"
              caption="같은 대진표를 다시 기록하려 할 때"
            />
          </div>
        </div>
      </section>

      {/* 3. 삭제하기 */}
      <section>
        <SectionTitle no={3}>ATP 점수 기록 삭제하기</SectionTitle>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          점수를 잘못 입력한 채 기록했다면 기록을 지우고 다시 기록할 수 있습니다.
        </p>
        <div className="space-y-6">
          <div className="space-y-2">
            <Step no={1}>
              대진표 생성기에서 <b>&lsquo;경기 종료 · 최종 순위 발표&rsquo;</b>를 다시
              엽니다.
            </Step>
            <Step no={2}>
              <b>&lsquo;ATP 점수 기록 삭제&rsquo;</b>를 누르고, 확인 창에서
              <b> &lsquo;확인&rsquo;</b>을 누릅니다.
            </Step>
            <Step no={3}>
              초록색 <b>&lsquo;ATP 점수 기록을 삭제했습니다.&rsquo;</b>가 나오면 완료입니다.
              점수를 고친 뒤 <b>&lsquo;ATP 점수 기록 생성&rsquo;</b>을 다시 누르면 새로
              기록됩니다.
            </Step>
          </div>
          <Shot
            src="09-delete-success.png"
            width={680}
            height={316}
            alt="ATP 점수 기록을 삭제했습니다 메시지"
            caption="삭제 성공"
          />
          <p className="text-sm text-gray-700 leading-relaxed">
            아직 기록하지 않은 대진표에서 삭제를 누르면 빨간색
            <b> &lsquo;이 대진표로 기록된 ATP 점수가 없습니다.&rsquo;</b>가 나옵니다.
          </p>
          <Shot
            src="10-delete-missing.png"
            width={680}
            height={316}
            alt="이 대진표로 기록된 ATP 점수가 없습니다 에러 메시지"
            caption="기록이 없는 대진표에서 삭제할 때"
          />

          <div className="card p-4 border-l-[3px] border-amber-400 bg-amber-50/50">
            <p className="font-bold text-gray-900 text-sm mb-1">꼭 알아 두세요</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              기록과 삭제는 <b>지금 대진표 생성기에 떠 있는 대진표</b>에만 적용됩니다.
              새 대진표를 만들거나 &lsquo;초기화&rsquo;를 누르면, 이전 대진표의 기록은
              화면에서 지울 수 없습니다. 고칠 것이 있으면 새 대진표를 만들기 전에
              처리해 주세요. 이미 넘어갔다면 운영진에게 알려 주세요.
            </p>
          </div>
        </div>
      </section>

      {/* 4. 순위 확인 */}
      <section>
        <SectionTitle no={4}>연도별 ATP 순위 확인하기</SectionTitle>
        <div className="space-y-6">
          <Step no={1}>
            왼쪽 메뉴(모바일은 오른쪽 위 메뉴)에서 <b>유용한기능 → ATP 순위 확인</b>을
            누릅니다.
          </Step>
          <Shot
            src="01-tools.png"
            width={748}
            height={680}
            alt="유용한기능 화면의 ATP 순위 확인 메뉴"
          />

          <Step no={2}>
            맨 위에서 <b>올해 시즌 요약</b>(기록한 경기일, 랭킹에 든 인원, 선두 점수)과
            <b> 우승·준우승</b>을 볼 수 있습니다.
          </Step>
          <Shot
            src="06-ranking-hero.png"
            width={700}
            height={1025}
            alt="ATP 순위 화면 상단의 시즌 요약과 우승·준우승"
            caption="올해 시즌 요약 (예시 데이터)"
          />

          <Step no={3}>
            <b>전체 순위</b>에서 내 순위·참가 횟수·점수를 확인합니다. 점수가 같으면 같은
            순위이고, 아직 기록이 없는 회원은 아래쪽에 따로 표시됩니다.
          </Step>
          <Shot
            src="07-ranking-standings.png"
            width={748}
            height={1694}
            alt="올해 회원별 전체 순위"
            caption="올해 전체 순위 (예시 데이터)"
          />

          <Step no={4}>
            <b>역대 시즌 TOP 3</b>에서 연도별 1·2·3위를 확인합니다. 기록이 있는 모든
            연도가 최신순으로 나옵니다.
          </Step>
          <Shot
            src="08-ranking-history.png"
            width={748}
            height={762}
            alt="연도별 1~3위 역대 시즌 TOP 3"
            caption="연도별 TOP 3 (예시 데이터)"
          />
        </div>
      </section>
    </div>
  );
}
