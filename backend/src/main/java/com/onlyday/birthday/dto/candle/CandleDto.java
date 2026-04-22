package com.onlyday.birthday.dto.candle;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public class CandleDto {

    public record AddCandleWithLetterRequest(
            @NotBlank @Size(max = 40) String nickname,
            @NotNull @DecimalMin("0.0") @DecimalMax("1.0") Double positionX,
            @NotNull @DecimalMin("0.0") @DecimalMax("1.0") Double positionY,
            @NotBlank @Size(max = 30) String candleColor,
            @NotBlank @Size(max = 30) String candleStyle,
            @NotBlank @Size(max = 1000) String letterContent
    ) {
    }

    public record CandleResponse(
            UUID candleId,
            String nickname,
            double positionX,
            double positionY,
            String candleColor,
            String candleStyle
    ) {
    }
}
