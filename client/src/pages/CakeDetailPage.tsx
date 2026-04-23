import {
  uploadImageToStorage,
  useCakeByShareToken,
  useCreateLetter,
  useLetters,
  useSaveLetter,
  useUnlockStates,
} from "@/hooks/useCakeLetterApi";
import { useAuthState } from "@/hooks/useAuth";
import { useState } from "react";
import { useParams } from "wouter";

export default function CakeDetailPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { isAuthenticated } = useAuthState();
  const { data: cake } = useCakeByShareToken(shareToken);
  const letterQueryOn = Boolean(cake?.cakeId) && isAuthenticated;
  const { data: letters = [] } = useLetters(cake?.cakeId, { enabled: letterQueryOn });
  const { data: unlockStates = [] } = useUnlockStates(cake?.cakeId, { enabled: letterQueryOn });
  const createLetter = useCreateLetter();
  const saveLetter = useSaveLetter();

  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [style, setStyle] = useState("classic");
  const [color, setColor] = useState("#ff77aa");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const submit = async () => {
    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = await uploadImageToStorage(imageFile);
    }
    await createLetter.mutateAsync({
      cakeShareToken: shareToken,
      nickname,
      content,
      candleStyle: style,
      candleColor: color,
      positionX: Math.random(),
      positionY: Math.random(),
      imageUrl,
    });
    setNickname("");
    setContent("");
    setImageFile(null);
  };

  if (!cake) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border rounded p-4">
        <h1 className="text-xl font-bold">{cake.title}</h1>
        <p className="text-sm text-gray-500">flavor: {cake.flavor} / candles: {cake.candleCount}</p>
      </div>

      <div className="border rounded p-4 space-y-2">
        <h2 className="font-semibold">편지 작성</h2>
        <input className="w-full border rounded p-2" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <textarea className="w-full border rounded p-2" placeholder="편지 내용" value={content} onChange={(e) => setContent(e.target.value)} />
        <div className="flex gap-2">
          <input className="border rounded p-2" value={style} onChange={(e) => setStyle(e.target.value)} />
          <input className="border rounded p-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <input className="border rounded p-2" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
        </div>
        <button className="bg-black text-white rounded px-3 py-2" onClick={submit}>등록</button>
      </div>

      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">서버 해금 상태</h2>
        {!isAuthenticated && (
          <p className="text-sm text-gray-500 mb-2">해금·편지 열람은 케이크 주인이 로그인한 경우에만 조회됩니다.</p>
        )}
        <div className="space-y-1">
          {unlockStates.map((u) => (
            <p key={u.featureKey} className="text-sm">
              {u.featureKey} (기준 {u.thresholdCount}) : {u.unlocked ? "해금" : "잠김"}
            </p>
          ))}
        </div>
      </div>

      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">편지 목록</h2>
        <div className="space-y-2">
          {letters.map((letter) => (
            <div key={letter.letterId} className="border rounded p-3">
              <p className="font-semibold">{letter.nickname}</p>
              <p>{letter.unlocked ? letter.content : "잠긴 편지"}</p>
              {letter.imageUrl && <a className="underline text-sm" href={letter.imageUrl} target="_blank">이미지 보기</a>}
              <div>
                <button className="border rounded px-2 py-1 mt-2" onClick={() => saveLetter.mutate(letter.letterId)}>
                  보관함 저장
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
