import { Cake, Letter, COMPLETION_LEVELS, DATE_CONSTANTS } from '@/types';
import { nanoid } from 'nanoid';

/**
 * 새로운 케이크 생성
 */
export function createNewCake(
  cakeType: Cake['cakeType'],
  birthdayDate: Date
): Cake {
  return {
    id: nanoid(),
    cakeType,
    birthdayDate: birthdayDate.getTime(),
    createdAt: Date.now(),
    letters: [],
  };
}

/**
 * 새로운 편지 생성
 */
export function createNewLetter(
  cakeId: string,
  nickname: string,
  content: string,
  candleDesign: Letter['candleDesign']
): Letter {
  return {
    id: nanoid(),
    cakeId,
    nickname,
    content,
    candleDesign,
    createdAt: Date.now(),
    isSaved: false,
    unlocked: true,
  };
}

/**
 * 생일 날짜 검증 (24시간 전부터 편지 작성 가능)
 */
export function canWriteLetter(birthdayDate: number): boolean {
  const now = Date.now();
  const hoursBeforeBirthday = (birthdayDate - now) / (1000 * 60 * 60);
  return hoursBeforeBirthday <= 24 && hoursBeforeBirthday > -24;
}

/**
 * 생일 당일 여부 확인
 */
export function isBirthdayToday(birthdayDate: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  const birthday = new Date(birthdayDate);
  birthday.setHours(0, 0, 0, 0);
  const birthdayTime = birthday.getTime();

  return todayTime === birthdayTime;
}

/**
 * 편지 만료 여부 확인 (생일 후 14일 경과)
 */
export function isLetterExpired(birthdayDate: number): boolean {
  const now = Date.now();
  const expiryDate = birthdayDate + DATE_CONSTANTS.LETTER_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  return now > expiryDate;
}

/**
 * 완성도 레벨 계산
 */
export function getCompletionLevel(letterCount: number): number {
  for (let i = COMPLETION_LEVELS.length - 1; i >= 0; i--) {
    if (letterCount >= COMPLETION_LEVELS[i].requiredLetters) {
      return COMPLETION_LEVELS[i].level;
    }
  }
  return 1;
}

/**
 * 다음 완성도 레벨까지 필요한 편지 개수
 */
export function getLettersNeededForNextLevel(letterCount: number): number {
  const currentLevel = getCompletionLevel(letterCount);
  const nextLevel = COMPLETION_LEVELS.find((l) => l.level === currentLevel + 1);

  if (!nextLevel) return 0; // 최대 레벨 도달

  return nextLevel.requiredLetters - letterCount;
}

/**
 * 편지 잠금 상태 결정 (촛불 수 기반)
 */
export function shouldLockLetter(letterIndex: number, totalLetters: number): boolean {
  const currentLevel = getCompletionLevel(totalLetters);
  const currentLevelInfo = COMPLETION_LEVELS.find((l) => l.level === currentLevel);

  if (!currentLevelInfo) return false;

  // 현재 레벨에서 표시할 수 있는 최대 촛불 개수
  const maxVisibleCandles = currentLevelInfo.requiredLetters + 3;

  return letterIndex >= maxVisibleCandles;
}

/**
 * 공유 URL 생성
 */
export function generateShareUrl(cakeId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/cake/${cakeId}`;
}

/**
 * URL에서 케이크 ID 추출
 */
export function extractCakeIdFromUrl(pathname: string): string | null {
  const match = pathname.match(/\/cake\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * 날짜를 한국어 형식으로 포맷
 */
export function formatDateKorean(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 시간 차이를 읽기 쉬운 형식으로 변환
 */
export function getTimeUntilBirthday(birthdayDate: number): string {
  const now = Date.now();
  const diff = birthdayDate - now;

  if (diff <= 0) {
    return '생일이 지났습니다';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days}일 ${hours}시간 남음`;
  }

  return `${hours}시간 남음`;
}

/**
 * 케이크를 이미지로 변환 (html2canvas 사용)
 */
export async function cakeToImage(elementId: string): Promise<Blob | null> {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const element = document.getElementById(elementId);

    if (!element) {
      console.error('Element not found');
      return null;
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob: Blob | null) => {
        resolve(blob);
      }, 'image/png');
    });
  } catch (error) {
    console.error('Failed to convert cake to image:', error);
    return null;
  }
}

/**
 * 이미지 다운로드
 */
export function downloadImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 클립보드에 텍스트 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * 색상 밝기 계산 (16진수 색상)
 */
export function getColorBrightness(hexColor: string): number {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * 색상에 따른 텍스트 색상 결정
 */
export function getContrastColor(hexColor: string): string {
  const brightness = getColorBrightness(hexColor);
  return brightness > 128 ? '#000000' : '#FFFFFF';
}
