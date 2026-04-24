package com.onlyday.birthday.service;

import com.onlyday.birthday.domain.letter.Letter;
import com.onlyday.birthday.repository.CakeRepository;
import com.onlyday.birthday.repository.LetterRepository;
import com.onlyday.birthday.time.CakeKstTimeWindow;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LetterLifecycleSchedulerService {

    private final CakeRepository cakeRepository;
    private final LetterRepository letterRepository;
    private final Clock clock;
    private final int retentionDaysAfterBirthday;

    public LetterLifecycleSchedulerService(CakeRepository cakeRepository,
                                           LetterRepository letterRepository,
                                           Clock clock,
                                           @Value("${app.letter.retention-days-after-birthday:14}")
                                           int retentionDaysAfterBirthday) {
        this.cakeRepository = cakeRepository;
        this.letterRepository = letterRepository;
        this.clock = clock;
        this.retentionDaysAfterBirthday = Math.max(0, retentionDaysAfterBirthday);
    }

    @Transactional
    @Scheduled(cron = "${app.scheduler.letter-visibility-cron}")
    public void publishLettersOnBirthday() {
        LocalDate todayKst = LocalDate.now(clock.withZone(CakeKstTimeWindow.KST));
        List<UUID> cakeIds = cakeRepository
                .findAllByBirthdayMonthAndDay(todayKst.getMonthValue(), todayKst.getDayOfMonth())
                .stream()
                .map(c -> c.getId())
                .toList();
        if (!cakeIds.isEmpty()) {
            letterRepository.publishLettersByCakeIds(cakeIds);
        }
    }

    /**
     * KST 기준: (오늘 KST − N일)보다 생일이 **이전**인 케이크의 편지를 말소. 보관함에 담긴 sourceLetterId 는 제외.
     */
    @Transactional
    @Scheduled(cron = "${app.scheduler.letter-cleanup-cron}")
    public void cleanupExpiredLetters() {
        LocalDate todayKst = LocalDate.now(clock.withZone(CakeKstTimeWindow.KST));
        for (Letter l : letterRepository.findLettersNotInSaved()) {
            if (CakeKstTimeWindow.isRetentionExpired(
                    todayKst, l.getCandle().getCake().getBirthday(), retentionDaysAfterBirthday)) {
                letterRepository.delete(l);
            }
        }
    }
}
