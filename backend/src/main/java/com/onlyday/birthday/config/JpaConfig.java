package com.onlyday.birthday.config;

import java.time.Clock;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/** BaseTimeEntity가 OffsetDateTime 이므로 감사 시각도 OffsetDateTime(UTC)으로 넣는다. */
@Configuration
@EnableJpaAuditing(dateTimeProviderRef = "offsetDateTimeProvider")
public class JpaConfig {

    @Bean
    public DateTimeProvider offsetDateTimeProvider(Clock clock) {
        return () -> Optional.of(OffsetDateTime.ofInstant(Instant.now(clock), ZoneOffset.UTC));
    }
}
