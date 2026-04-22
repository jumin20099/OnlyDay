package com.onlyday.birthday.service;

import com.onlyday.birthday.domain.user.User;
import com.onlyday.birthday.dto.auth.AuthDto;
import com.onlyday.birthday.exception.BusinessException;
import com.onlyday.birthday.security.JwtTokenService;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public AuthService(UserService userService, PasswordEncoder passwordEncoder, JwtTokenService jwtTokenService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }

    @Transactional
    public AuthDto.AuthResponse signup(AuthDto.SignupRequest request) {
        if (userService.existsByEmail(request.email())) {
            throw new BusinessException("EMAIL_ALREADY_EXISTS", "Email is already registered", HttpStatus.CONFLICT);
        }

        User user = userService.save(User.builder()
                .id(UUID.randomUUID())
                .email(request.email())
                .displayName(request.displayName())
                .passwordHash(passwordEncoder.encode(request.password()))
                .build());

        String accessToken = jwtTokenService.createAccessToken(user.getId(), user.getEmail());
        return toResponse(user, accessToken);
    }

    @Transactional(readOnly = true)
    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userService.getByEmail(request.email());
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BusinessException("INVALID_CREDENTIALS", "Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        String accessToken = jwtTokenService.createAccessToken(user.getId(), user.getEmail());
        return toResponse(user, accessToken);
    }

    private AuthDto.AuthResponse toResponse(User user, String accessToken) {
        return new AuthDto.AuthResponse(
                accessToken,
                new AuthDto.UserPayload(user.getId(), user.getEmail(), user.getDisplayName())
        );
    }
}
