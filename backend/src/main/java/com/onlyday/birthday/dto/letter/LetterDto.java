package com.onlyday.birthday.dto.letter;

import java.time.OffsetDateTime;
import java.util.UUID;

public class LetterDto {

    public record LetterResponse(
            UUID letterId,
            UUID candleId,
            String nickname,
            double positionX,
            double positionY,
            String candleColor,
            String candleStyle,
            String content,
            String imageUrl,
            boolean unlocked,
            OffsetDateTime createdAt
    ) {
    }

    public record SavedLetterResponse(
            UUID savedLetterId,
            UUID sourceLetterId,
            String nickname,
            String content,
            OffsetDateTime savedAt
    ) {
    }
}
