package com.onlyday.birthday.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 편지 본문 잠금의 단일 규칙(플랜 11). 케이크 장식용 UnlockRule / CakeUnlockState 해금과 별개.
 * i번째 편지(가시·생성일 오름차순)에 필요한 촛불 = (i+1) * unlockStepCandles.
 */
@Component
public class LetterContentUnlockPolicy {

    private final int unlockStepCandles;

    public LetterContentUnlockPolicy(
            @Value("${app.letter.unlock-step-candles:1}") int unlockStepCandles) {
        this.unlockStepCandles = Math.max(1, unlockStepCandles);
    }

    public boolean isContentUnlocked(int letterIndexZeroBased, int totalCandleCount) {
        int required = (letterIndexZeroBased + 1) * unlockStepCandles;
        return totalCandleCount >= required;
    }
}
