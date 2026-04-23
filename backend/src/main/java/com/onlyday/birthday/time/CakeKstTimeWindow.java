package com.onlyday.birthday.time;

import java.time.Clock;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

/**
 * 생일(달력 1일, KST) 기준 케이크 작성/공개 시각(플랜 단일 정책).
 * <ul>
 *   <li>{@code openAt} = 생일 KST 0시 − 24h</li>
 *   <li>{@code closeAt} = 생일 KST 0시 + 24h → 총 48h, 작성은 {@code [openAt, closeAt)}</li>
 *   <li>14일 말소·스케줄의 “오늘”은 {@link #KST} + {@link java.time.Clock}</li>
 * </ul>
 */
public final class CakeKstTimeWindow {

    public static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private CakeKstTimeWindow() {
    }

    /**
     * @param birthday 생일(날짜만, KST 달력에 해당하는 날)
     * @return 편지 작성이 열리는 시각(UTC offset 포함)
     */
    public static OffsetDateTime openAtForBirthday(LocalDate birthday) {
        ZonedDateTime startKst = birthday.atStartOfDay(KST);
        return startKst.minus(24, ChronoUnit.HOURS).toOffsetDateTime();
    }

    /**
     * @param birthday 생일(KST)
     * @return 편지 작성 마감(해당 시각은 포함되지 않음, [open, close) )
     */
    public static OffsetDateTime closeAtForBirthday(LocalDate birthday) {
        ZonedDateTime startKst = birthday.atStartOfDay(KST);
        return startKst.plus(24, ChronoUnit.HOURS).toOffsetDateTime();
    }

    /** 오늘(KST)이 해당 케이크의 생일 달력인지 */
    public static boolean isBirthdayTodayKst(Clock clock, LocalDate cakeBirthday) {
        LocalDate todayKst = LocalDate.now(clock.withZone(KST));
        return cakeBirthday.equals(todayKst);
    }

    /**
     * 촛불/편지 작성 허용 구간 [openAt, closeAt). 서버 Clock + DB에 저장된 open/close만 사용.
     */
    public static boolean isWithinWriteWindow(Clock clock, OffsetDateTime openAt, OffsetDateTime closeAt) {
        OffsetDateTime now = OffsetDateTime.now(clock);
        return !now.isBefore(openAt) && now.isBefore(closeAt);
    }
}
