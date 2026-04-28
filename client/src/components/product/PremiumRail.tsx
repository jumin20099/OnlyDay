import { Crown, Megaphone, Palette, Star } from "lucide-react";

export function PremiumRail() {
  const items = [
    { icon: <Palette className="h-4 w-4" />, title: "커스텀 케이크", body: "내 취향대로 케이크 무드 완성" },
    { icon: <Star className="h-4 w-4" />, title: "하이라이트 편지", body: "가장 소중한 편지를 맨 위에" },
    { icon: <Crown className="h-4 w-4" />, title: "프리미엄 공개 연출", body: "생일 순간을 더 눈부시게" },
  ];

  return (
    <aside className="rounded-[2rem] border border-white/60 bg-white/52 p-4 shadow-sm backdrop-blur">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        <Megaphone className="h-4 w-4" />
        더 특별한 옵션
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
