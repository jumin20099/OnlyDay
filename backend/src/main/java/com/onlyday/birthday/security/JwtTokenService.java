package com.onlyday.birthday.security;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.text.ParseException;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import com.onlyday.birthday.exception.BusinessException;

@Component
public class JwtTokenService {

    private final byte[] secret;
    private final String issuer;

    public JwtTokenService(@Value("${app.jwt.supabase-secret}") String secret,
                           @Value("${app.jwt.issuer}") String issuer) {
        this.secret = secret.getBytes();
        this.issuer = issuer;
    }

    public AuthUser parseUser(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            if (!JWSAlgorithm.HS256.equals(signedJWT.getHeader().getAlgorithm())) {
                throw new BusinessException("UNAUTHORIZED", "Unsupported JWT algorithm", HttpStatus.UNAUTHORIZED);
            }
            if (!signedJWT.verify(new MACVerifier(secret))) {
                throw new BusinessException("UNAUTHORIZED", "Invalid JWT signature", HttpStatus.UNAUTHORIZED);
            }

            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            validateClaims(claims);
            String sub = claims.getSubject();
            return new AuthUser(UUID.fromString(sub));
        } catch (ParseException | JOSEException | IllegalArgumentException ex) {
            throw new BusinessException("UNAUTHORIZED", "Invalid token", HttpStatus.UNAUTHORIZED);
        }
    }

    private void validateClaims(JWTClaimsSet claims) {
        Date exp = claims.getExpirationTime();
        if (exp == null || exp.toInstant().isBefore(Instant.now())) {
            throw new BusinessException("UNAUTHORIZED", "Token expired", HttpStatus.UNAUTHORIZED);
        }

        String tokenIssuer = claims.getIssuer();
        if (tokenIssuer != null && !tokenIssuer.startsWith(issuer)) {
            throw new BusinessException("UNAUTHORIZED", "Invalid token issuer", HttpStatus.UNAUTHORIZED);
        }
    }
}
