import { Crown, Megaphone, Palette, Star } from "lucide-react";

export function PremiumRail() {
  const items = [
    { icon: <Palette className="h-4 w-4" />, title: "Custom cake", body: "케이크 이미지와 무드를 더 정교하게" },
    { icon: <Star className="h-4 w-4" />, title: "Highlighted letters", body: "특별한 편지는 상단에 고정" },
    { icon: <Crown className="h-4 w-4" />, title: "Premium reveal", body: "생일 당일 전용 공개 연출" },
  ];

  return (
    <aside className="rounded-[2rem] border border-white/60 bg-white/52 p-4 shadow-sm backdrop-blur">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        <Megaphone className="h-4 w-4" />
        optional premium
      </p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-[1.25rem] bg-white/65 p-3">
            <p className="flex items-center gap-2 text-sm font-black text-slate-950">
              <span className="rounded-full bg-slate-950 p-2 text-white">{item.icon}</span>
              {item.title}
            </p>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{item.body}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
