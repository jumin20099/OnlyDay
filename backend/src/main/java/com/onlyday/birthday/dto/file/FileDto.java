package com.onlyday.birthday.dto.file;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class FileDto {

    public record PresignRequest(
            @NotBlank String filename,
            @NotBlank @Pattern(regexp = "image/.*", message = "Only image content types are allowed")
            String contentType,
            String folder
    ) {
    }

    public record PresignResponse(
            String uploadUrl,
            String fileUrl,
            String key
    ) {
    }
}
