package com.onlyday.birthday.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public class AuthDto {

    public record SignupRequest(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 100) String password,
            @NotBlank @Size(max = 80) String displayName
    ) {
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {
    }

    public record AuthResponse(
            String accessToken,
            UserPayload user
    ) {
    }

    public record UserPayload(
            UUID id,
            String email,
            String displayName
    ) {
    }
}
