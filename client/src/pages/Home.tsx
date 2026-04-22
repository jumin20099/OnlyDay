import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCake } from '@/contexts/CakeContext';
import { Gift, Heart, Sparkles } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();
  const { allCakes, savedLetters } = useCake();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-green-50">
      {/* 헤더 */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎂</span>
            <h1 className="text-2xl font-bold gradient-text">MMD</h1>
          </div>
          <nav className="flex gap-4">
            {savedLetters.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => setLocation('/saved-letters')}
                className="gap-2"
              >
                <Heart className="w-4 h-4" />
                보관함 ({savedLetters.length})
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* 히어로 섹션 */}
        <section className="text-center mb-20">
          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">생일을 함께 축하해요</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              당신의 생일 케이크를 만들고, 소중한 사람들의 촛불 편지로 함께 완성해보세요.
              <br />
              참여할수록 더 화려해지는 마법 같은 경험을 만나보세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation('/customize')}
              size="lg"
              className="gap-2 h-12 px-8"
            >
              <Gift className="w-5 h-5" />
              내 케이크 만들기
            </Button>
            <Button
              onClick={() => setLocation('/saved-letters')}
              variant="outline"
              size="lg"
              className="gap-2 h-12 px-8"
            >
              <Heart className="w-5 h-5" />
              보관함 보기
            </Button>
          </div>
        </section>

        {/* 특징 섹션 */}
        <section className="grid md:grid-cols-3 gap-6 mb-20">
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-3">케이크 커스터마이징</h3>
            <p className="text-muted-foreground">
              초콜릿, 망고, 말차 등 다양한 케이크 중 선택하고 생일 날짜를 설정하세요.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">🕯️</div>
            <h3 className="text-xl font-bold mb-3">촛불 편지 작성</h3>
            <p className="text-muted-foreground">
              공유 링크로 접속한 친구들이 촛불 형태의 편지를 남길 수 있습니다.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-3">함께 완성하기</h3>
            <p className="text-muted-foreground">
              참여할수록 케이크가 화려해지고 새로운 디자인이 해금됩니다.
            </p>
          </Card>
        </section>

        {/* 최근 케이크 섹션 */}
        {allCakes.length > 0 && (
          <section className="mb-20">
            <h3 className="text-2xl font-bold mb-8">최근 생성된 케이크</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCakes.slice(-3).reverse().map((cake) => (
                <Card
                  key={cake.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => setLocation(`/cake/${cake.id}`)}
                >
                  <div className="text-4xl mb-3">🎂</div>
                  <h4 className="font-bold mb-2">생일 케이크</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {new Date(cake.birthdayDate).toLocaleDateString('ko-KR')}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>{cake.letters.length}개의 편지</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* 사용 방법 섹션 */}
        <section className="bg-white/50 rounded-3xl p-12 border border-border/50">
          <h3 className="text-3xl font-bold mb-8 text-center">사용 방법</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="font-bold mb-2">케이크 선택</h4>
              <p className="text-sm text-muted-foreground">
                좋아하는 케이크 종류와 생일 날짜를 선택합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="font-bold mb-2">링크 공유</h4>
              <p className="text-sm text-muted-foreground">
                생성된 고유 링크를 친구들과 공유합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="font-bold mb-2">편지 작성</h4>
              <p className="text-sm text-muted-foreground">
                친구들이 촛불 편지를 남기고 디자인을 커스터마이징합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h4 className="font-bold mb-2">완성 & 공유</h4>
              <p className="text-sm text-muted-foreground">
                완성된 케이크를 이미지로 저장하고 공유합니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-border/50 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 MMD - 내 생일 케이크를 꾸며줘. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
