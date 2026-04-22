import React from 'react';
import { Cake, CAKE_TYPES, COMPLETION_LEVELS } from '@/types';
import { getCompletionLevel } from '@/utils/cakeUtils';

interface CakeVisualizationProps {
  cake: Cake;
  size?: 'sm' | 'md' | 'lg';
}

export function CakeVisualization({ cake, size = 'lg' }: CakeVisualizationProps) {
  const cakeInfo = CAKE_TYPES[cake.cakeType];
  const completionLevel = getCompletionLevel(cake.letters.length);
  const levelInfo = COMPLETION_LEVELS.find((l) => l.level === completionLevel);

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-9xl',
  };

  const containerSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // 완성도 레벨에 따른 장식 요소
  const decorationElements = levelInfo?.unlockedFeatures || [];
  const hasSparkles = decorationElements.includes('sparkle_effect');
  const hasGlow = decorationElements.includes('glow_effect');
  const hasAnimation = decorationElements.includes('animation');

  return (
    <div
      className={`cake-container rounded-3xl text-center ${containerSizes[size]} relative overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${cakeInfo.baseColor}20 0%, ${cakeInfo.accentColor}20 100%)`,
      }}
    >
      {/* 배경 장식 */}
      {hasSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute text-2xl animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* 케이크 아이콘 */}
      <div
        className={`${sizeClasses[size]} mb-4 transition-all duration-300 ${
          hasGlow ? 'filter drop-shadow-lg' : ''
        } ${hasAnimation ? 'animate-bounce' : ''}`}
        style={{
          filter: hasGlow ? `drop-shadow(0 0 20px ${cakeInfo.accentColor})` : 'none',
        }}
      >
        {cakeInfo.icon}
      </div>

      {/* 케이크 정보 */}
      <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: cakeInfo.baseColor }}>
        {cakeInfo.name}
      </h2>
      <p className="text-sm md:text-base text-muted-foreground mb-6">
        {cakeInfo.description}
      </p>

      {/* 완성도 표시 */}
      <div className="bg-white/50 rounded-2xl p-4 mb-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-sm">완성도 레벨</span>
          <span className="text-xl font-bold" style={{ color: cakeInfo.baseColor }}>
            {completionLevel}/5
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-300"
            style={{
              width: `${(completionLevel / 5) * 100}%`,
              background: `linear-gradient(90deg, ${cakeInfo.baseColor} 0%, ${cakeInfo.accentColor} 100%)`,
            }}
          />
        </div>
      </div>

      {/* 촛불 표시 */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {cake.letters.map((letter, idx) => (
          <div
            key={letter.id}
            className="candle relative group"
            style={{
              width: size === 'sm' ? '24px' : size === 'md' ? '32px' : '48px',
              height: size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px',
            }}
          >
            {/* 촛불 몸체 */}
            <div
              className="w-full h-full rounded-full relative"
              style={{ backgroundColor: letter.candleDesign.color }}
            >
              {/* 불꽃 */}
              <div
                className="candle-flame absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full"
                style={{
                  width: size === 'sm' ? '6px' : size === 'md' ? '8px' : '12px',
                  height: size === 'sm' ? '12px' : size === 'md' ? '16px' : '24px',
                  backgroundColor: '#FCD34D',
                  boxShadow: `0 0 ${size === 'sm' ? '4px' : size === 'md' ? '6px' : '12px'} rgba(252, 211, 77, 0.6)`,
                }}
              />
            </div>

            {/* 호버 효과 */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-primary" />
          </div>
        ))}
      </div>

      {/* 편지 개수 */}
      <div className="text-base md:text-lg font-semibold" style={{ color: cakeInfo.baseColor }}>
        {cake.letters.length}개의 촛불 편지
      </div>

      {/* 레벨 설명 */}
      {levelInfo && (
        <p className="text-xs md:text-sm text-muted-foreground mt-3">
          {levelInfo.description}
        </p>
      )}
    </div>
  );
}

// 스타일 정의
const style = document.createElement('style');
style.textContent = `
  @keyframes twinkle {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }
`;
document.head.appendChild(style);
