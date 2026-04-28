package com.onlyday.birthday.time;

import java.time.Clock;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.MonthDay;
import java.time.OffsetDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

/**
 * 생일(달력 1일, KST) 기준 케이크 작성/공개 시각(플랜 단일 정책).
 * <p>
 * 저장된 {@link LocalDate}는 사용자가 입력한 연도를 유지하되, 생일 판정/작성창 계산은
 * <strong>월·일 기준으로 반복</strong>됩니다.
 * 매년 같은 월·일에
 * KST 달력으로 반복됩니다. {@code openAt/closeAt} 는 조회·검증 시 {@link Clock}으로 재계산합니다.
 * <ul>
 *   <li>{@code openAt} = 생일 KST 0시 − 24h</li>
 *   <li>{@code closeAt} = 생일 KST 0시 + 24h → 총 48h, 작성은 {@code [openAt, closeAt)}</li>
 *   <li>14일 말소·스케줄의 “오늘”은 {@link #KST} + {@link java.time.Clock}</li>
 * </ul>
 */
public final class CakeKstTimeWindow {

    public static final ZoneId KST = ZoneId.of("Asia/Seoul");
    public record TimeWindow(OffsetDateTime openAt, OffsetDateTime closeAt) {
    }

    private CakeKstTimeWindow() {
    }

    /** @return 편지 작성이 열리는 시각(UTC offset 포함) */
    public static OffsetDateTime openAtForBirthday(LocalDate birthday) {
        ZonedDateTime startKst = birthday.atStartOfDay(KST);
        return startKst.minus(24, ChronoUnit.HOURS).toOffsetDateTime();
    }

    /**
     * @param birthday 생일(KST) — <strong>연도</strong>는 해당 "생일이 속한" 연도(실제 KST)
     * @return 편지 작성 마감(해당 시각은 포함되지 않음, [open, close) )
     */
    public static OffsetDateTime closeAtForBirthday(LocalDate birthday) {
        ZonedDateTime startKst = birthday.atStartOfDay(KST);
        return startKst.plus(24, ChronoUnit.HOURS).toOffsetDateTime();
    }

    private static MonthDay toMonthDay(LocalDate birthday) {
        return MonthDay.from(birthday);
    }

    private static boolean sameMonthDayKst(Clock clock, LocalDate storedBirthday) {
        LocalDate todayKst = LocalDate.now(clock.withZone(KST));
        return toMonthDay(todayKst).equals(toMonthDay(storedBirthday));
    }

    /** 오늘(KST)이 해당 케이크의 생일 달력(월·일)인지 — 저장 연도는 비교에 쓰지 않음. */
    public static boolean isBirthdayTodayKst(Clock clock, LocalDate cakeBirthday) {
        return sameMonthDayKst(clock, cakeBirthday);
    }

    public static boolean isWithinWriteWindow(Clock clock, OffsetDateTime openAt, OffsetDateTime closeAt) {
        OffsetDateTime now = OffsetDateTime.now(clock);
        return !now.isBefore(openAt) && now.isBefore(closeAt);
    }

    static LocalDate birthdayInYear(int kstYear, int month, int dayOfMonth) {
        try {
            return LocalDate.of(kstYear, month, dayOfMonth);
        } catch (DateTimeException e) {
            if (month == 2 && dayOfMonth == 29 && !Year.isLeap(kstYear)) {
                return LocalDate.of(kstYear, 2, 28);
            }
            throw e;
        }
    }

    /**
     * [open, close) 48h 창 — 저장된 open/close 대신 월·일로 매년 갱신.
     */
    public static boolean isWithinWriteWindowForBirthday(Clock clock, LocalDate storedBirthdayMonthDay) {
        int m = storedBirthdayMonthDay.getMonthValue();
        int d = storedBirthdayMonthDay.getDayOfMonth();
        int y0 = LocalDate.now(clock.withZone(KST)).getYear();
        for (int year = y0 - 1; year <= y0 + 1; year++) {
            LocalDate b = birthdayInYear(year, m, d);
            OffsetDateTime o = openAtForBirthday(b);
            OffsetDateTime c = closeAtForBirthday(b);
            if (isWithinWriteWindow(clock, o, c)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 배너·응답: 지금이 작성 창 안이면 그 창, 아니면 <em>다음</em> 48h 창(곧 열릴).
     */
    public static TimeWindow openCloseForDisplay(Clock clock, LocalDate storedBirthdayMonthDay) {
        int m = storedBirthdayMonthDay.getMonthValue();
        int d = storedBirthdayMonthDay.getDayOfMonth();
        OffsetDateTime now = OffsetDateTime.now(clock);
        int y0 = LocalDate.now(clock.withZone(KST)).getYear();
        for (int year = y0 - 1; year <= y0 + 2; year++) {
            LocalDate b = birthdayInYear(year, m, d);
            OffsetDateTime o = openAtForBirthday(b);
            OffsetDateTime c = closeAtForBirthday(b);
            if (!now.isBefore(o) && now.isBefore(c)) {
                return new TimeWindow(o, c);
            }
        }
        for (int year = y0 - 1; year <= y0 + 3; year++) {
            LocalDate b = birthdayInYear(year, m, d);
            OffsetDateTime o = openAtForBirthday(b);
            if (o.isAfter(now)) {
                return new TimeWindow(o, closeAtForBirthday(b));
            }
        }
        LocalDate b = birthdayInYear(y0 + 1, m, d);
        return new TimeWindow(openAtForBirthday(b), closeAtForBirthday(b));
    }

    public static TimeWindow currentWriteWindowForPersistence(Clock clock, LocalDate storedBirthdayMonthDay) {
        return openCloseForDisplay(clock, storedBirthdayMonthDay);
    }

    /**
     * 생일(월·일) 기준: "마지막으로 끝난 생일 달력" + retention &lt; 오늘 KST이면 true (미보관 편지 말소).
     */
    public static boolean isRetentionExpired(
            LocalDate todayKst,
            LocalDate storedBirthdayMonthDay,
            int retentionDaysAfterLastBirthday) {
        if (retentionDaysAfterLastBirthday < 0) {
            return false;
        }
        int m = storedBirthdayMonthDay.getMonthValue();
        int d = storedBirthdayMonthDay.getDayOfMonth();
        int y = todayKst.getYear();
        LocalDate thisYear = birthdayInYear(y, m, d);
        LocalDate last;
        if (!thisYear.isAfter(todayKst)) {
            last = thisYear;
        } else {
            last = birthdayInYear(y - 1, m, d);
        }
        return last.plusDays(retentionDaysAfterLastBirthday).isBefore(todayKst);
    }
}
