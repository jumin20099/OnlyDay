import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCake } from '@/contexts/CakeContext';
import { CakeVisualization } from '@/components/CakeVisualization';
import { CandleStyle, CandleDesign } from '@/types';
import {
  createNewLetter,
  canWriteLetter,
  isBirthdayToday,
  cakeToImage,
  downloadImage,
} from '@/utils/cakeUtils';
import { toast } from 'sonner';
import { ArrowLeft, Download, Lock } from 'lucide-react';

export default function CakePage() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { getCakeById, addLetter, saveLetter, removeLetter, savedLetters } = useCake();

  const cake = getCakeById(id || '');
  const [nickname, setNickname] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [candleStyle, setCandleStyle] = useState<CandleStyle>('classic');
  const [candleColor, setCandleColor] = useState('#E8B4E8');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLetterForm, setShowLetterForm] = useState(false);

  useEffect(() => {
    if (!cake) {
      setLocation('/404');
    }
  }, [cake, setLocation]);

  if (!cake) {
    return null;
  }

  const canWrite = canWriteLetter(cake.birthdayDate);
  const isBirthday = isBirthdayToday(cake.birthdayDate);

  const handleSubmitLetter = () => {
    if (!nickname.trim()) {
      toast.error('닉네임을 입력해주세요');
      return;
    }
    if (!letterContent.trim()) {
      toast.error('편지 내용을 입력해주세요');
      return;
    }

    setIsSubmitting(true);

    const candleDesign: CandleDesign = {
      style: candleStyle,
      color: candleColor,
      glowIntensity: 'medium',
    };

    const newLetter = createNewLetter(cake.id, nickname, letterContent, candleDesign);
    addLetter(newLetter);

    toast.success('편지가 등록되었습니다!');
    setNickname('');
    setLetterContent('');
    setCandleStyle('classic');
    setCandleColor('#E8B4E8');
    setShowLetterForm(false);
    setIsSubmitting(false);
  };

  const handleDownloadCake = async () => {
    const blob = await cakeToImage('cake-visualization');
    if (blob) {
      downloadImage(blob, `my-birthday-cake-${new Date().getTime()}.png`);
      toast.success('케이크 이미지가 다운로드되었습니다!');
    } else {
      toast.error('이미지 생성에 실패했습니다');
    }
  };

  const handleSaveLetter = (letterId: string) => {
    saveLetter(letterId);
    toast.success('편지가 보관함에 저장되었습니다!');
  };

  const handleRemoveLetter = (letterId: string) => {
    removeLetter(letterId);
    toast.success('편지가 삭제되었습니다');
  };

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
          <h1 className="text-2xl font-bold gradient-text">생일 케이크</h1>
          <Button
            onClick={handleDownloadCake}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            다운로드
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 케이크 시각화 */}
          <div className="lg:col-span-2">
            <Card className="p-8 sticky top-20">
              <div id="cake-visualization">
                <CakeVisualization cake={cake} size="lg" />
              </div>
            </Card>
          </div>

          {/* 사이드바 - 편지 작성 및 목록 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 편지 작성 폼 */}
            {canWrite ? (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">촛불 편지 작성</h3>

                {!showLetterForm ? (
                  <Button
                    onClick={() => setShowLetterForm(true)}
                    className="w-full"
                  >
                    편지 작성하기
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nickname" className="text-sm font-semibold">
                        닉네임
                      </Label>
                      <Input
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="이름을 입력하세요"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold">촛불 디자인</Label>
                      <div className="flex gap-2 mt-2">
                        <select
                          value={candleStyle}
                          onChange={(e) => setCandleStyle(e.target.value as CandleStyle)}
                          className="flex-1 px-3 py-2 rounded-lg border border-border"
                        >
                          <option value="classic">클래식</option>
                          <option value="gradient">그라디언트</option>
                          <option value="glitter">글리터</option>
                          <option value="pastel">파스텔</option>
                          <option value="neon">네온</option>
                        </select>
                        <input
                          type="color"
                          value={candleColor}
                          onChange={(e) => setCandleColor(e.target.value)}
                          className="w-12 h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="letter" className="text-sm font-semibold">
                        편지 내용
                      </Label>
                      <Textarea
                        id="letter"
                        value={letterContent}
                        onChange={(e) => setLetterContent(e.target.value)}
                        placeholder="생일 축하 메시지를 작성해주세요"
                        className="mt-2 min-h-24"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowLetterForm(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        취소
                      </Button>
                      <Button
                        onClick={handleSubmitLetter}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? '작성 중...' : '등록하기'}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-6 bg-muted/50">
                <p className="text-sm text-muted-foreground text-center">
                  생일 24시간 전부터 편지를 작성할 수 있습니다
                </p>
              </Card>
            )}

            {/* 편지 목록 */}
            {cake.letters.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">받은 편지</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cake.letters.map((letter) => {
                    const isSaved = savedLetters.some((sl) => sl.letterData.id === letter.id);

                    return (
                      <div
                        key={letter.id}
                        className="letter-card relative"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className="w-8 h-8 rounded-full flex-shrink-0"
                            style={{ backgroundColor: letter.candleDesign.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{letter.nickname}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(letter.createdAt).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                        </div>

                        {isBirthday ? (
                          <>
                            <p className="text-sm text-foreground/80 mb-3 line-clamp-3">
                              {letter.content}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSaveLetter(letter.id)}
                                disabled={isSaved}
                                className="flex-1 gap-1"
                              >
                                {isSaved ? '저장됨' : '저장하기'}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveLetter(letter.id)}
                                className="text-destructive"
                              >
                                삭제
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="bg-muted/50 rounded-lg p-3 text-center">
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                              <Lock className="w-3 h-3" />
                              생일 당일에만 볼 수 있습니다
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
