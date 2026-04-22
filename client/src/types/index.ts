/**
 * MMD (내 생일 케이크를 꾸며줘) - 데이터 모델 및 타입 정의
 * 프론트엔드 전용 애플리케이션이므로 모든 데이터는 LocalStorage에 저장됨
 */

/**
 * 케이크 종류 정의
 */
export type CakeType = 'chocolate' | 'mango' | 'matcha' | 'strawberry' | 'vanilla';

export interface CakeTypeInfo {
  id: CakeType;
  name: string;
  description: string;
  baseColor: string;
  accentColor: string;
  icon: string;
}

/**
 * 촛불 스타일 정의
 */
export type CandleStyle = 'classic' | 'gradient' | 'glitter' | 'pastel' | 'neon';

export interface CandleDesign {
  style: CandleStyle;
  color: string;
  glowIntensity: 'low' | 'medium' | 'high';
  flameColor?: string;
}

/**
 * 편지 데이터 모델
 */
export interface Letter {
  id: string;
  cakeId: string;
  nickname: string;
  content: string;
  candleDesign: CandleDesign;
  createdAt: number; // timestamp
  isSaved: boolean; // 편지 보관함에 저장되었는지 여부
  isLocked: boolean; // 촛불 수 부족으로 잠금 여부
}

/**
 * 케이크 데이터 모델
 */
export interface Cake {
  id: string; // UUID - 공유 링크에 사용
  cakeType: CakeType;
  birthdayDate: number; // timestamp (자정 기준)
  createdAt: number; // timestamp
  letters: Letter[];
  customization?: {
    frosting?: string;
    decoration?: string;
    message?: string;
  };
}

/**
 * 케이크 완성도 레벨 정의
 */
export interface CompletionLevel {
  level: number;
  requiredLetters: number;
  unlockedFeatures: string[];
  description: string;
}

/**
 * 케이크 시각화 상태
 */
export interface CakeVisualization {
  baseDesign: string;
  candleCount: number;
  completionLevel: number;
  totalLetters: number;
  decorationElements: string[];
}

/**
 * 편지 보관함 항목
 */
export interface SavedLetter {
  id: string;
  originalCakeId: string;
  letterData: Letter;
  savedAt: number; // timestamp
  cakeType: CakeType;
  birthdayDate: number;
}

/**
 * 앱 전역 상태
 */
export interface AppState {
  currentCake: Cake | null;
  allCakes: Cake[];
  savedLetters: SavedLetter[];
  userPreferences: {
    theme: 'light' | 'dark';
    language: 'ko' | 'en';
  };
}

/**
 * 완성도 레벨 정의 (촛불 개수 기준)
 */
export const COMPLETION_LEVELS: CompletionLevel[] = [
  {
    level: 1,
    requiredLetters: 0,
    unlockedFeatures: ['base_cake'],
    description: '기본 케이크',
  },
  {
    level: 2,
    requiredLetters: 3,
    unlockedFeatures: ['candles', 'basic_decoration'],
    description: '촛불 추가',
  },
  {
    level: 3,
    requiredLetters: 7,
    unlockedFeatures: ['frosting_upgrade', 'sparkle_effect'],
    description: '프로스팅 업그레이드',
  },
  {
    level: 4,
    requiredLetters: 12,
    unlockedFeatures: ['premium_decoration', 'glow_effect'],
    description: '프리미엄 장식',
  },
  {
    level: 5,
    requiredLetters: 20,
    unlockedFeatures: ['special_effects', 'animation'],
    description: '특수 효과 해금',
  },
];

/**
 * 날짜 관련 상수
 */
export const DATE_CONSTANTS = {
  LETTER_EXPIRY_DAYS: 14, // 생일 후 14일 경과 시 자동 삭제
  LETTER_VISIBLE_HOURS_BEFORE: 24, // 생일 24시간 전부터 편지 작성 가능
};

/**
 * 케이크 타입 정보
 */
export const CAKE_TYPES: Record<CakeType, CakeTypeInfo> = {
  chocolate: {
    id: 'chocolate',
    name: '초콜릿 케이크',
    description: '풍부한 초콜릿 향의 우아한 케이크',
    baseColor: '#8B6F47',
    accentColor: '#D4A574',
    icon: '🍫',
  },
  mango: {
    id: 'mango',
    name: '망고 케이크',
    description: '상큼한 망고의 트로피컬 케이크',
    baseColor: '#F4A460',
    accentColor: '#FFD700',
    icon: '🥭',
  },
  matcha: {
    id: 'matcha',
    name: '말차 케이크',
    description: '은은한 말차 향의 세련된 케이크',
    baseColor: '#7CB342',
    accentColor: '#C5E1A5',
    icon: '🍵',
  },
  strawberry: {
    id: 'strawberry',
    name: '딸기 케이크',
    description: '달콤한 딸기의 로맨틱 케이크',
    baseColor: '#E91E63',
    accentColor: '#F48FB1',
    icon: '🍓',
  },
  vanilla: {
    id: 'vanilla',
    name: '바닐라 케이크',
    description: '클래식한 바닐라의 따뜻한 케이크',
    baseColor: '#D2B48C',
    accentColor: '#F5DEB3',
    icon: '🍰',
  },
};
