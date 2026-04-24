package com.onlyday.birthday.time;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.Test;

class CakeKstTimeWindowTest {

    @Test
    void openToClose_is48Hours() {
        LocalDate birthday = LocalDate.of(2026, 3, 10);
        var open = CakeKstTimeWindow.openAtForBirthday(birthday);
        var close = CakeKstTimeWindow.closeAtForBirthday(birthday);
        assertThat(Duration.between(open, close).toHours()).isEqualTo(48L);
    }

    @Test
    void isBirthdayTodayKst_usesKstDate_andIgnoresStoredYear() {
        // 2026-03-09 16:00 UTC = 2026-03-10 01:00 KST
        Clock clock = Clock.fixed(Instant.parse("2026-03-09T16:00:00Z"), ZoneId.of("UTC"));
        assertThat(CakeKstTimeWindow.isBirthdayTodayKst(clock, LocalDate.of(2007, 3, 10))).isTrue();
    }

    @Test
    void isWithinWriteWindow_openCloseHalfOpen() {
        LocalDate birthday = LocalDate.of(2026, 5, 1);
        OffsetDateTime open = CakeKstTimeWindow.openAtForBirthday(birthday);
        OffsetDateTime close = CakeKstTimeWindow.closeAtForBirthday(birthday);
        OffsetDateTime mid = open.plusHours(1);
        Clock inWindow = Clock.fixed(mid.toInstant(), ZoneId.of("UTC"));
        assertThat(CakeKstTimeWindow.isWithinWriteWindow(inWindow, open, close)).isTrue();
        Clock beforeOpen = Clock.fixed(open.toInstant().minus(1, ChronoUnit.HOURS), ZoneId.of("UTC"));
        assertThat(CakeKstTimeWindow.isWithinWriteWindow(beforeOpen, open, close)).isFalse();
        Clock atClose = Clock.fixed(close.toInstant(), ZoneId.of("UTC"));
        assertThat(CakeKstTimeWindow.isWithinWriteWindow(atClose, open, close)).isFalse();
    }
}
