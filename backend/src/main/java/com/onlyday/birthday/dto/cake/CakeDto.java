package com.onlyday.birthday.dto.cake;

import com.onlyday.birthday.domain.cake.CakeFlavor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public class CakeDto {

    /**
     * openAt/closeAt 은 서버에서 생일(KST)로만 계산한다. 클라이언트에서 보내지 않는다.
     */
    public record CreateRequest(
            @NotBlank @Size(max = 100) String title,
            @NotNull CakeFlavor flavor,
            @NotNull LocalDate birthday
    ) {
    }

    public record UpdateRequest(
            @NotBlank @Size(max = 100) String title,
            @NotNull CakeFlavor flavor,
            @NotNull LocalDate birthday,
            @Size(max = 2000) String cakeImageUrl
    ) {
    }

    public record CakeSummary(
            UUID cakeId,
            String title,
            CakeFlavor flavor,
            String shareToken,
            UUID ownerId,
            LocalDate birthday,
            OffsetDateTime openAt,
            OffsetDateTime closeAt,
            int candleCount,
            String cakeImageUrl
    ) {
    }
}
