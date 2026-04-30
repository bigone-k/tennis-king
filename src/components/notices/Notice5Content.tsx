interface ClubNameCandidate {
  id: string;
  name: string;
  tagline: string;
  description: string;
  extras?: { label: string; value: string }[];
  highlight?: string;
}

const candidates: ClubNameCandidate[] = [
  {
    id: "love40",
    name: "러브포티",
    tagline: "Love-40",
    description:
      "점수상으론 불리한 상황(0-40)임에도 불구하고, \"지고 있어도 즐겁게 친다\"는 클럽 철학으로 해석.",
    extras: [
      { label: "정기모임", value: "러브포티 데이" },
      { label: "대회 팀명", value: "Team Love40" },
      { label: "굿즈", value: "L40 약자 활용 가능" },
      { label: "해시태그", value: "#러브포티 #love40tennis" },
    ],
  },
  {
    id: "ltc",
    name: "러브 서티 클럽",
    tagline: "Love Thirty Club, LTC",
    description:
      "테니스에서 0:30 (Love Thirty)는 긴장감이 생기는 분기점. 위기에서 흐름을 바꾸는 순간, 경기가 가장 흥미로워지는 순간을 의미합니다.",
  },
  {
    id: "andante",
    name: "안단테",
    tagline: "ANDANTE",
    description: "'안'전하게 '단'련하는 '테'니스",
    highlight: "안 · 단 · 테",
  },
  {
    id: "everrally",
    name: "EverRally",
    tagline: "에버랠리",
    description:
      "영원한(Forever)과 테니스의 랠리(Rally)를 합쳤습니다. 코트 위에서 공을 주고받듯, 우리들의 인연과 즐거움도 끊임없이 이어진다는 뜻입니다.",
  },
  {
    id: "cocourt",
    name: "Co-Court",
    tagline: "코-코트",
    description:
      "'함께'를 뜻하는 접두사 Co-와 Court(코트)의 합성어. 발음이 귀여우면서도 트렌디한 브랜드 이름 같은 느낌을 줍니다.",
  },
  {
    id: "jipyeong",
    name: "지평테니스클럽",
    tagline: "지평 MT × 삶의 지평",
    description:
      "클럽 역사의 중요 의사 결정이 대부분 지평 엠티에서 이뤄짐. 테니스를 통해 삶의 지평을 넓혀가자는 뜻.",
  },
  {
    id: "neman",
    name: "네만",
    tagline: "네트만 넘기자",
    description:
      "즐거운 테니스를 목표로, 실력보단 다같이 즐겁게 네트만 잘 넘기자라는 의미.",
  },
  {
    id: "noad",
    name: "노애드클럽",
    tagline: "No-Ad Club",
    description:
      "단 한 포인트의 긴장감을 즐기고, 일상의 무게를 덜어내는(No-Ad) 우리들의 코트라는 의미. 'No-Advantage'를 'No-Add(더할 것이 없음)'로 비틀어, 군더더기 없이 테니스 그 자체만 즐기는 모임이라는 뜻을 담습니다.",
    extras: [
      { label: "컨셉", value: "복잡한 생각은 No, 즐거움에만 집중" },
      { label: "슬로건", value: "Just Play, No Stress." },
    ],
  },
  {
    id: "inside",
    name: "인사이드클럽",
    tagline: "Inside Club",
    description:
      "코트 안(In)에서의 열정과 사람들 사이(Inside)의 끈끈함을 동시에 표현합니다.",
  },
  {
    id: "tejina",
    name: "테진아",
    tagline: "테니스에 진심인 아마추어",
    description: "테니스에 진심인 아마추어들의 모임.",
  },
  {
    id: "tenniscut",
    name: "테니스커트",
    tagline: "Tennis Cut",
    description: "테니스는 커트(슬라이스)가 진짜.",
  },
  {
    id: "crosscourt",
    name: "크로스코트",
    tagline: "Cross Court",
    description: "후위에서 꾸준히 치는 샷처럼, 천천히 오래 가자는 뜻.",
  },
];

export default function Notice5Content() {
  return (
    <div className="space-y-8">
      {/* 헤더 배너 */}
      <div className="bg-emerald-900 rounded-2xl p-6 md:p-8 text-white text-center">
        <p className="text-xs font-medium mb-2 text-emerald-300 uppercase tracking-widest">
          Club Naming Proposal
        </p>
        <h2 className="text-lg md:text-2xl font-extrabold tracking-tight">
          테니스 클럽 이름 후보군
        </h2>
        <p className="text-sm text-white/60 mt-2">
          총 {candidates.length}개 후보 · 의견을 모아주세요
        </p>
      </div>

      {/* 안내 카드 */}
      <div className="card p-5 border-l-[3px] border-emerald-400 bg-emerald-50/40">
        <div className="flex items-start gap-3">
          <span className="text-xl">🎾</span>
          <div>
            <p className="font-extrabold text-gray-900 mb-1">
              어떤 이름이 우리 클럽과 가장 잘 어울릴까요?
            </p>
            <p className="text-sm text-gray-600">투표 해주세요.</p>
          </div>
        </div>
      </div>

      {/* 후보 리스트 */}
      <div className="space-y-4">
        {candidates.map((c, idx) => (
          <div
            key={c.id}
            className="card p-5 md:p-6 hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-600 text-white text-sm font-extrabold shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                  <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900">
                    {c.name}
                  </h3>
                  <span className="text-xs md:text-sm text-emerald-700 font-medium">
                    ({c.tagline})
                  </span>
                </div>

                {c.highlight && (
                  <p className="text-sm font-bold text-emerald-700 mb-2 tracking-wider">
                    {c.highlight}
                  </p>
                )}

                <p className="text-sm md:text-[15px] text-gray-700 leading-relaxed">
                  {c.description}
                </p>

                {c.extras && c.extras.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                      활용 / 상세
                    </p>
                    <ul className="space-y-1.5">
                      {c.extras.map((ex) => (
                        <li
                          key={ex.label}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="inline-flex shrink-0 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                            {ex.label}
                          </span>
                          <span className="text-gray-700">{ex.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 마무리 안내 */}
      <div className="card p-5 border-l-[3px] border-amber-400 bg-amber-50/40">
        <p className="font-extrabold text-gray-900 mb-3">📌 클럽 선정 방식</p>
        <div className="space-y-2">
          {[
            {
              label: "1차 투표",
              text: "12개 후보군 중 공동 2위까지 선정 (복수 투표)",
            },
            {
              label: "2차 투표",
              text: "공동 2위 중 최종 클럽명 투표 (단수 투표)",
            },
            { label: "최종 결정", text: "최종 결정 이후 상금 지급 예정" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-2">
              <span className="inline-flex shrink-0 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[11px] font-bold">
                {item.label}
              </span>
              <p className="text-sm text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
