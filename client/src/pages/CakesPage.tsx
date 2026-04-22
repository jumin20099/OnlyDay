import { logout } from "@/hooks/useAuth";
import { useCakes, useCreateCake } from "@/hooks/useCakeLetterApi";
import { useState } from "react";
import { useLocation } from "wouter";

export default function CakesPage() {
  const [, navigate] = useLocation();
  const { data: cakes = [] } = useCakes();
  const createCake = useCreateCake();
  const [title, setTitle] = useState("내 생일 케이크");
  const [flavor, setFlavor] = useState<"CHOCOLATE" | "MANGO" | "MATCHA" | "STRAWBERRY" | "VANILLA">("CHOCOLATE");
  const [birthday, setBirthday] = useState("");

  const create = async () => {
    if (!birthday) return;
    const openAt = new Date(`${birthday}T00:00:00.000Z`);
    openAt.setUTCDate(openAt.getUTCDate() - 1);
    const closeAt = new Date(`${birthday}T23:59:59.000Z`);

    await createCake.mutateAsync({
      title,
      flavor,
      birthday,
      openAt: openAt.toISOString(),
      closeAt: closeAt.toISOString(),
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">내 케이크</h1>
        <div className="space-x-2">
          <button className="border rounded px-3 py-1" onClick={() => navigate("/saved-letters")}>보관함</button>
          <button className="border rounded px-3 py-1" onClick={logout}>로그아웃</button>
        </div>
      </div>

      <div className="border rounded p-4 space-y-2">
        <h2 className="font-semibold">케이크 생성</h2>
        <input className="w-full border rounded p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select className="w-full border rounded p-2" value={flavor} onChange={(e) => setFlavor(e.target.value as typeof flavor)}>
          <option value="CHOCOLATE">CHOCOLATE</option>
          <option value="MANGO">MANGO</option>
          <option value="MATCHA">MATCHA</option>
          <option value="STRAWBERRY">STRAWBERRY</option>
          <option value="VANILLA">VANILLA</option>
        </select>
        <input className="w-full border rounded p-2" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
        <button className="bg-black text-white rounded px-3 py-2" onClick={create}>생성</button>
      </div>

      <div className="space-y-2">
        {cakes.map((cake) => (
          <div key={cake.cakeId} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{cake.title}</p>
              <p className="text-sm text-gray-500">{cake.birthday} · candles {cake.candleCount}</p>
            </div>
            <button className="border rounded px-3 py-1" onClick={() => navigate(`/cake/${cake.shareToken}`)}>
              열기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
