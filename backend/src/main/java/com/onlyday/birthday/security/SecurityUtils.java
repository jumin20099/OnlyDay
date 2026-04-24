package com.onlyday.birthday.security;

import com.onlyday.birthday.exception.BusinessException;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static AuthUser currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthUser authUser)) {
            throw new BusinessException("UNAUTHORIZED", "Authentication required", HttpStatus.UNAUTHORIZED);
        }
        return authUser;
    }

    /** Authorization 헤더가 있고 유효한 JWT인 경우에만; 비로그인(익명) 쓰기 API용. */
    public static Optional<AuthUser> currentUserOptional() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthUser authUser)) {
            return Optional.empty();
        }
        return Optional.of(authUser);
    }
}
