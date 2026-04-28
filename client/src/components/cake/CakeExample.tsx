import { Cake } from "./Cake";

export function CakeExample() {
  return (
    <div className="max-w-sm rounded-[2rem] bg-white/60 p-5 shadow-xl backdrop-blur">
      <Cake
        flavor="matcha"
        candleCount={12}
        candleColors={["yellow", "lime", "green", "white"]}
        unlocked
        premiumGlow
      />
    </div>
  );
}
