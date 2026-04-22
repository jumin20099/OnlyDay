import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCake } from '@/contexts/CakeContext';
import { CakeVisualization } from '@/components/CakeVisualization';
import { CAKE_TYPES, CakeType, Cake } from '@/types';
import { createNewCake, generateShareUrl, copyToClipboard, formatDateKorean } from '@/utils/cakeUtils';
import { toast } from 'sonner';
import { ArrowRight, Copy, Share2 } from 'lucide-react';

export default function CustomizePage() {
  const [, setLocation] = useLocation();
  const { addCake } = useCake();

  const [selectedCakeType, setSelectedCakeType] = useState<CakeType>('chocolate');
  const [birthdayDate, setBirthdayDate] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdCakeId, setCreatedCakeId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');

  // 미리보기용 임시 케이크
  const previewCake: Cake = {
    id: 'preview',
    cakeType: selectedCakeType,
    birthdayDate: birthdayDate ? new Date(birthdayDate).getTime() : Date.now(),
    createdAt: Date.now(),
    letters: [],
  };

  const handleCreateCake = () => {
    if (!birthdayDate) {
      toast.error('생일 날짜를 선택해주세요');
      return;
    }

    setIsCreating(true);
    const date = new Date(birthdayDate);
    const newCake = createNewCake(selectedCakeType, date);

    addCake(newCake);
    setCreatedCakeId(newCake.id);
    setShareUrl(generateShareUrl(newCake.id));

    toast.success('케이크가 생성되었습니다!');
    setIsCreating(false);
  };

  const handleCopyShareUrl = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      toast.success('링크가 복사되었습니다!');
    } else {
      toast.error('복사에 실패했습니다');
    }
  };

  const handleShareUrl = () => {
    if (navigator.share) {
      navigator.share({
        title: 'MMD - 내 생일 케이크를 꾸며줘',
        text: '내 생일 케이크에 촛불 편지를 남겨주세요!',
        url: shareUrl,
      }).catch(err => console.log('Share failed:', err));
    } else {
      handleCopyShareUrl();
    }
  };

  const handleGoToCake = () => {
    if (createdCakeId) {
      setLocation(`/cake/${createdCakeId}`);
    }
  };

  if (createdCakeId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">{CAKE_TYPES[selectedCakeType].icon}</div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {CAKE_TYPES[selectedCakeType].name}
            </h1>
            <p className="text-muted-foreground">
              {formatDateKorean(new Date(birthdayDate))}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-foreground mb-2">공유 링크</p>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyShareUrl}
                className="flex-shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleShareUrl}
              variant="outline"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              공유하기
            </Button>
            <Button
              onClick={handleGoToCake}
              className="flex-1"
            >
              케이크 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            내 생일 케이크를 꾸며줘
          </h1>
          <p className="text-muted-foreground text-lg">
            당신의 생일 케이크를 선택하고 친구들과 함께 완성해보세요
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 왼쪽: 설정 */}
          <div className="space-y-8">
            {/* 케이크 선택 */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">케이크 선택</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(CAKE_TYPES).map(([key, cakeInfo]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCakeType(key as CakeType)}
                    className={`p-4 rounded-2xl transition-all duration-300 text-center ${
                      selectedCakeType === key
                        ? 'ring-2 ring-primary bg-primary/10 scale-105'
                        : 'bg-white/50 hover:bg-white/80 border border-border'
                    }`}
                  >
                    <div className="text-5xl mb-2">{cakeInfo.icon}</div>
                    <p className="font-semibold text-sm">{cakeInfo.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {cakeInfo.description}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* 생일 날짜 선택 */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">생일 날짜</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="birthday" className="text-base font-semibold mb-2 block">
                    생일을 선택해주세요
                  </Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={birthdayDate}
                    onChange={(e) => setBirthdayDate(e.target.value)}
                    className="w-full h-12 text-base"
                  />
                </div>
                {birthdayDate && (
                  <div className="p-4 bg-accent/20 rounded-lg">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">선택된 날짜:</span> {formatDateKorean(new Date(birthdayDate))}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      생일 24시간 전부터 친구들이 편지를 남길 수 있습니다
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* 생성 버튼 */}
            <div className="flex gap-4">
              <Button
                onClick={() => setLocation('/')}
                variant="outline"
                className="flex-1 h-12"
              >
                돌아가기
              </Button>
              <Button
                onClick={handleCreateCake}
                disabled={!birthdayDate || isCreating}
                className="flex-1 h-12"
              >
                {isCreating ? '생성 중...' : '케이크 생성하기'}
              </Button>
            </div>
          </div>

          {/* 오른쪽: 미리보기 */}
          <div className="sticky top-20">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">미리보기</h2>
              <CakeVisualization cake={previewCake} size="md" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
