import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cake, Letter, SavedLetter, AppState } from '@/types';

interface CakeContextType {
  // 현재 케이크
  currentCake: Cake | null;
  setCake: (cake: Cake | null) => void;

  // 편지 관리
  addLetter: (letter: Letter) => void;
  removeLetter: (letterId: string) => void;
  saveLetter: (letterId: string) => void;
  unsaveLetter: (letterId: string) => void;

  // 편지 보관함
  savedLetters: SavedLetter[];

  // 케이크 목록
  allCakes: Cake[];
  addCake: (cake: Cake) => void;
  getCakeById: (id: string) => Cake | null;

  // 유틸리티
  clearAllData: () => void;
}

const CakeContext = createContext<CakeContextType | undefined>(undefined);

const STORAGE_KEY = 'mmd_app_state';
const DEFAULT_STATE: AppState = {
  currentCake: null,
  allCakes: [],
  savedLetters: [],
  userPreferences: {
    theme: 'light',
    language: 'ko',
  },
};

export function CakeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // LocalStorage에서 데이터 로드
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setState(parsedState);
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // 상태 변경 시 LocalStorage에 저장
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const setCake = (cake: Cake | null) => {
    setState((prev) => ({
      ...prev,
      currentCake: cake,
    }));
  };

  const addLetter = (letter: Letter) => {
    setState((prev) => {
      if (!prev.currentCake) return prev;

      // currentCake와 allCakes 모두 업데이트
      const updatedCurrentCake = {
        ...prev.currentCake,
        letters: [...prev.currentCake.letters, letter],
      };

      const updatedAllCakes = prev.allCakes.map((cake) =>
        cake.id === prev.currentCake!.id
          ? updatedCurrentCake
          : cake
      );

      return {
        ...prev,
        currentCake: updatedCurrentCake,
        allCakes: updatedAllCakes,
      };
    });
  };

  const removeLetter = (letterId: string) => {
    setState((prev) => {
      if (!prev.currentCake) return prev;

      const updatedCurrentCake = {
        ...prev.currentCake,
        letters: prev.currentCake.letters.filter((l) => l.id !== letterId),
      };

      const updatedAllCakes = prev.allCakes.map((cake) =>
        cake.id === prev.currentCake!.id
          ? updatedCurrentCake
          : cake
      );

      return {
        ...prev,
        currentCake: updatedCurrentCake,
        allCakes: updatedAllCakes,
      };
    });
  };

  const saveLetter = (letterId: string) => {
    setState((prev) => {
      if (!prev.currentCake) return prev;

      const letter = prev.currentCake.letters.find((l) => l.id === letterId);
      if (!letter) return prev;

      const savedLetter: SavedLetter = {
        id: `saved_${letterId}`,
        originalCakeId: prev.currentCake.id,
        letterData: { ...letter, isSaved: true },
        savedAt: Date.now(),
        cakeType: prev.currentCake.cakeType,
        birthdayDate: prev.currentCake.birthdayDate,
      };

      const updatedCurrentCake = {
        ...prev.currentCake,
        letters: prev.currentCake.letters.map((l) =>
          l.id === letterId ? { ...l, isSaved: true } : l
        ),
      };

      const updatedAllCakes = prev.allCakes.map((cake) =>
        cake.id === prev.currentCake!.id
          ? updatedCurrentCake
          : cake
      );

      return {
        ...prev,
        savedLetters: [...prev.savedLetters, savedLetter],
        currentCake: updatedCurrentCake,
        allCakes: updatedAllCakes,
      };
    });
  };

  const unsaveLetter = (letterId: string) => {
    setState((prev) => {
      const updatedCurrentCake = prev.currentCake
        ? {
            ...prev.currentCake,
            letters: prev.currentCake.letters.map((l) =>
              l.id === letterId ? { ...l, isSaved: false } : l
            ),
          }
        : null;

      const updatedAllCakes = updatedCurrentCake
        ? prev.allCakes.map((cake) =>
            cake.id === updatedCurrentCake.id
              ? updatedCurrentCake
              : cake
          )
        : prev.allCakes;

      return {
        ...prev,
        savedLetters: prev.savedLetters.filter((sl) => sl.letterData.id !== letterId),
        currentCake: updatedCurrentCake,
        allCakes: updatedAllCakes,
      };
    });
  };

  const addCake = (cake: Cake) => {
    setState((prev) => ({
      ...prev,
      allCakes: [...prev.allCakes, cake],
      currentCake: cake,
    }));
  };

  const getCakeById = (id: string): Cake | null => {
    return state.allCakes.find((cake) => cake.id === id) || null;
  };

  const clearAllData = () => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  // 자동 만료 로직: 생일 후 14일 경과 시 편지 삭제
  useEffect(() => {
    if (!isLoaded) return;

    const checkAndRemoveExpiredLetters = () => {
      setState((prev) => {
        const now = Date.now();
        const EXPIRY_MS = 14 * 24 * 60 * 60 * 1000; // 14일

        const updatedAllCakes = prev.allCakes.map((cake) => {
          const expiryDate = cake.birthdayDate + EXPIRY_MS;
          if (now > expiryDate && cake.letters.length > 0) {
            console.log(
              `[자동 만료] 케이크의 편지들이 만료되었습니다 (생일: ${new Date(cake.birthdayDate).toLocaleDateString('ko-KR')})`
            );
            return { ...cake, letters: [] };
          }
          return cake;
        });

        const updatedCurrentCake = prev.currentCake
          ? updatedAllCakes.find((c) => c.id === prev.currentCake!.id) || prev.currentCake
          : null;

        return {
          ...prev,
          allCakes: updatedAllCakes,
          currentCake: updatedCurrentCake,
        };
      });
    };

    // 초기 체크
    checkAndRemoveExpiredLetters();

    // 매일 자정에 체크
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    const timeout = setTimeout(() => {
      checkAndRemoveExpiredLetters();
      const interval = setInterval(checkAndRemoveExpiredLetters, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  }

  const value: CakeContextType = {
    currentCake: state.currentCake,
    setCake,
    addLetter,
    removeLetter,
    saveLetter,
    unsaveLetter,
    savedLetters: state.savedLetters,
    allCakes: state.allCakes,
    addCake,
    getCakeById,
    clearAllData,
  };

  return <CakeContext.Provider value={value}>{children}</CakeContext.Provider>;
}

export function useCake() {
  const context = useContext(CakeContext);
  if (!context) {
    throw new Error('useCake must be used within CakeProvider');
  }
  return context;
}
