package com.onlyday.birthday.dto.unlock;

public class UnlockDto {

    public record UnlockStateResponse(
            String featureKey,
            int thresholdCount,
            boolean unlocked
    ) {
    }
}
