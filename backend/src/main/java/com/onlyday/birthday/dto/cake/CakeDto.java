package com.onlyday.birthday.dto.cake;

import com.onlyday.birthday.domain.cake.CakeFlavor;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public class CakeDto {

    public record CreateRequest(
            @NotBlank @Size(max = 100) String title,
            @NotNull CakeFlavor flavor,
            @NotNull LocalDate birthday,
            @NotNull OffsetDateTime openAt,
            @NotNull @Future OffsetDateTime closeAt
    ) {
    }

    public record UpdateRequest(
            @NotBlank @Size(max = 100) String title,
            @NotNull CakeFlavor flavor,
            @NotNull OffsetDateTime openAt,
            @NotNull OffsetDateTime closeAt
    ) {
    }

    public record CakeSummary(
            UUID cakeId,
            String title,
            CakeFlavor flavor,
            String shareToken,
            LocalDate birthday,
            OffsetDateTime openAt,
            OffsetDateTime closeAt,
            int candleCount
    ) {
    }
}
