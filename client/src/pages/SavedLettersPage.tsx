import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCake } from '@/contexts/CakeContext';
import { CAKE_TYPES } from '@/types';
import { formatDateKorean } from '@/utils/cakeUtils';
import { toast } from 'sonner';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';

export default function SavedLettersPage() {
  const [, setLocation] = useLocation();
  const { savedLetters, unsaveLetter } = useCake();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const handleRemoveSavedLetter = (letterId: string) => {
    unsaveLetter(letterId);
    toast.success('편지가 보관함에서 제거되었습니다');
    setSelectedLetter(null);
  };

  const selectedLetterData = selectedLetter
    ? savedLetters.find((sl) => sl.letterData.id === selectedLetter)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Button>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
            <Heart className="w-8 h-8" />
            편지 보관함
          </h1>
          <div className="w-24" />
        </div>

        {savedLetters.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold mb-2">아직 저장된 편지가 없습니다</h2>
            <p className="text-muted-foreground mb-6">
              생일 당일에 받은 편지를 보관함에 저장할 수 있습니다
            </p>
            <Button onClick={() => setLocation('/')}>
              홈으로 돌아가기
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 편지 목록 */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <h3 className="text-lg font-bold mb-4">저장된 편지 ({savedLetters.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {savedLetters.map((savedLetter) => (
                    <button
                      key={savedLetter.letterData.id}
                      onClick={() => setSelectedLetter(savedLetter.letterData.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedLetter === savedLetter.letterData.id
                          ? 'bg-primary/10 ring-2 ring-primary'
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <p className="font-semibold text-sm truncate">
                        {savedLetter.letterData.nickname}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateKorean(new Date(savedLetter.savedAt))}
                      </p>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* 편지 상세 보기 */}
            <div className="lg:col-span-2">
              {selectedLetterData ? (
                <Card className="p-8 sticky top-20">
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="w-16 h-16 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: selectedLetterData.letterData.candleDesign.color,
                        }}
                      />
                      <div>
                        <h2 className="text-2xl font-bold">
                          {selectedLetterData.letterData.nickname}
                        </h2>
                        <p className="text-muted-foreground">
                          {formatDateKorean(new Date(selectedLetterData.letterData.createdAt))}
                        </p>
                      </div>
                    </div>

                    {/* 케이크 정보 */}
                    <div className="bg-muted/50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground mb-2">케이크 정보</p>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">
                          {CAKE_TYPES[selectedLetterData.cakeType].icon}
                        </span>
                        <div>
                          <p className="font-semibold">
                            {CAKE_TYPES[selectedLetterData.cakeType].name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateKorean(new Date(selectedLetterData.birthdayDate))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 편지 내용 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-4">편지 내용</h3>
                    <div className="bg-white/50 rounded-lg p-6 border border-border/50 min-h-48">
                      <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                        {selectedLetterData.letterData.content}
                      </p>
                    </div>
                  </div>

                  {/* 촛불 디자인 정보 */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">촛불 스타일</p>
                      <p className="font-semibold capitalize">
                        {selectedLetterData.letterData.candleDesign.style}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">촛불 색상</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{
                            backgroundColor: selectedLetterData.letterData.candleDesign.color,
                          }}
                        />
                        <p className="font-semibold">
                          {selectedLetterData.letterData.candleDesign.color}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setSelectedLetter(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      다른 편지 보기
                    </Button>
                    <Button
                      onClick={() =>
                        handleRemoveSavedLetter(selectedLetterData.letterData.id)
                      }
                      variant="destructive"
                      className="flex-1 gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제하기
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-12 text-center flex items-center justify-center min-h-96">
                  <div>
                    <div className="text-6xl mb-4">👈</div>
                    <p className="text-muted-foreground">
                      왼쪽 목록에서 편지를 선택하면 내용을 볼 수 있습니다
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
