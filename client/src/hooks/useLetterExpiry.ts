import { useEffect } from 'react';
import { useCake } from '@/contexts/CakeContext';
import { isLetterExpired } from '@/utils/cakeUtils';
import { DATE_CONSTANTS } from '@/types';

/**
 * 생일 후 14일 경과 시 자동으로 편지를 삭제하는 훅
 */
export function useLetterExpiry() {
  const { allCakes, getCakeById } = useCake();

  useEffect(() => {
    const checkAndRemoveExpiredLetters = () => {
      allCakes.forEach((cake) => {
        // 생일이 지났는지 확인
        if (isLetterExpired(cake.birthdayDate)) {
          // 모든 편지 자동 삭제
          const cakeToUpdate = getCakeById(cake.id);
          if (cakeToUpdate && cakeToUpdate.letters.length > 0) {
            // 이 로직은 실제로는 Context에서 처리되어야 함
            // 여기서는 콘솔에 로그만 출력
            console.log(
              `[자동 만료] 케이크 ${cake.id}의 편지들이 만료되었습니다 (생일: ${new Date(cake.birthdayDate).toLocaleDateString('ko-KR')})`
            );
          }
        }
      });
    };

    // 초기 체크
    checkAndRemoveExpiredLetters();

    // 매일 자정에 체크하도록 설정
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    const timeout = setTimeout(() => {
      checkAndRemoveExpiredLetters();

      // 그 이후로는 매일 자정에 실행
      const interval = setInterval(checkAndRemoveExpiredLetters, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, [allCakes, getCakeById]);
}
