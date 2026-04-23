package com.onlyday.birthday.service;

import com.onlyday.birthday.domain.letter.Letter;
import com.onlyday.birthday.dto.letter.LetterDto;
import org.springframework.stereotype.Component;

/**
 * 편지 본문 잠금 + API 응답(콘텐츠 null)을 한 경로에서만 조합(플랜 11).
 */
@Component
public class LetterResponseMapper {

    private final LetterContentUnlockPolicy letterContentUnlockPolicy;

    public LetterResponseMapper(LetterContentUnlockPolicy letterContentUnlockPolicy) {
        this.letterContentUnlockPolicy = letterContentUnlockPolicy;
    }

    public LetterDto.LetterResponse toLockedAwareResponse(Letter letter, int indexInVisibleOrder, int cakeCandleCount) {
        boolean unlocked = letterContentUnlockPolicy.isContentUnlocked(indexInVisibleOrder, cakeCandleCount);
        return new LetterDto.LetterResponse(
                letter.getId(),
                letter.getCandle().getId(),
                letter.getCandle().getNickname(),
                unlocked ? letter.getContent() : null,
                unlocked ? letter.getImageUrl() : null,
                unlocked,
                letter.getCreatedAt()
        );
    }
}
