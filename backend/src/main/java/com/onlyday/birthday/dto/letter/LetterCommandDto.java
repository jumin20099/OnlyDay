package com.onlyday.birthday.dto.letter;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public class LetterCommandDto {

    public record CreateLetterRequest(
            @NotBlank String cakeShareToken,
            @NotBlank @Size(max = 40) String nickname,
            @NotNull @DecimalMin("0.0") @DecimalMax("1.0") Double positionX,
            @NotNull @DecimalMin("0.0") @DecimalMax("1.0") Double positionY,
            @NotBlank @Size(max = 30) String candleColor,
            @NotBlank @Size(max = 30) String candleStyle,
            @NotBlank @Size(max = 2000) String content,
            @Size(max = 500) String imageUrl
    ) {
    }

    public record SaveLetterRequest(
            @NotNull UUID letterId
    ) {
    }
}
