package com.onlyday.birthday.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * JPA ddl-auto=update 는 기존 CHECK 제약(cakes_flavor_check)을 자동 확장하지 못하므로,
 * 앱 기동 시 허용 flavor 목록을 현재 enum 기준으로 재설정한다.
 */
@Slf4j
@Component
public class CakeFlavorConstraintBootstrap {

    private final JdbcTemplate jdbcTemplate;

    public CakeFlavorConstraintBootstrap(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void alignCakeFlavorCheckConstraint() {
        try {
            jdbcTemplate.execute("ALTER TABLE cakes DROP CONSTRAINT IF EXISTS cakes_flavor_check");
            jdbcTemplate.execute("""
                    ALTER TABLE cakes
                    ADD CONSTRAINT cakes_flavor_check CHECK (
                        flavor IN (
                            'CHOCOLATE',
                            'MANGO',
                            'MATCHA',
                            'STRAWBERRY',
                            'VANILLA',
                            'CHEESE',
                            'LEMON',
                            'GREEN_GRAPE',
                            'RED_GRAPE',
                            'BLUEBERRY'
                        )
                    )
                    """);
            log.info("cakes_flavor_check constraint aligned to extended flavor set.");
        } catch (Exception e) {
            log.warn("Failed to align cakes_flavor_check constraint (will rely on existing schema).", e);
        }
    }
}
