"use client";

import Image from "next/image";
import { useActionState } from "react";
import { submitAccessCode, type GateState } from "@/lib/auth/actions";

const initialState: GateState = { error: null };

export default function GateForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(
    submitAccessCode,
    initialState,
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <span className="relative block w-16 h-16 overflow-hidden rounded-2xl bg-white shadow-md">
            <Image src="/noad_logo.png" alt="NoAD" fill sizes="64px" className="object-cover" />
          </span>
          <p className="text-2xl font-extrabold tracking-tight text-gray-900 mt-4">
            NoAD
          </p>
          <p className="text-sm text-gray-400 mt-1">
            클럽 회원 전용 페이지입니다
          </p>
        </div>

        <form action={formAction} className="card p-6 space-y-4">
          <input type="hidden" name="next" value={next} />

          <div className="space-y-2">
            <label
              htmlFor="code"
              className="block text-sm font-bold text-gray-900"
            >
              가입코드
            </label>
            <input
              id="code"
              name="code"
              type="password"
              autoComplete="off"
              autoFocus
              placeholder="클럽에서 공유받은 코드"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {state.error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-[0.99]"
          >
            {pending ? "확인 중…" : "입장하기"}
          </button>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed">
            코드를 모르시면 클럽 단톡방에 문의해 주세요.
          </p>
        </form>
      </div>
    </div>
  );
}
