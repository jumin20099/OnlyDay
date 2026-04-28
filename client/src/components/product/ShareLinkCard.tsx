import { GlassCard } from "./Primitives";
import { Copy, Share2 } from "lucide-react";

type Props = {
  url: string;
  candleCount: number;
  onCopy: () => void;
  onShare: () => void;
};

export function ShareLinkCard({ url, candleCount, onCopy, onShare }: Props) {
  return (
    <GlassCard className="overflow-hidden p-2 sm:p-4">
      <div className="rounded-[1.3rem] bg-slate-950 p-4 text-white sm:rounded-[1.5rem]">
        <h3 className="mt-1 text-lg font-black tracking-[-0.04em] sm:mt-2 sm:text-xl">친구의 촛불이 필요해요.</h3>
        <p className="mt-1 text-xs leading-5 text-white/65 sm:mt-2 sm:text-sm sm:leading-6">
          지금 촛불은 총 {candleCount}개에요.<br></br> 링크를 공유하고 촛불을 모아보세요.
        </p>
        <div className="mt-3 rounded-2xl bg-white/10 px-3 py-2 text-[11px] font-semibold text-white/70 sm:mt-4">
          <span className="line-clamp-1 break-all">{url}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-xs font-black text-slate-950"
          >
            <Copy className="h-4 w-4" />
            링크 복사
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white/12 px-4 py-3 text-xs font-black text-white ring-1 ring-white/20"
          >
            <Share2 className="h-4 w-4" />
            공유하기
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
