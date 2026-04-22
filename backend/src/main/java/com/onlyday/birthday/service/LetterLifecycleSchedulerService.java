package com.onlyday.birthday.service;

import com.onlyday.birthday.repository.CakeRepository;
import com.onlyday.birthday.repository.LetterRepository;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
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

    public LetterLifecycleSchedulerService(CakeRepository cakeRepository,
                                           LetterRepository letterRepository) {
        this.cakeRepository = cakeRepository;
        this.letterRepository = letterRepository;
    }

    @Transactional
    @Scheduled(cron = "${app.scheduler.letter-visibility-cron}")
    public void publishLettersOnBirthday() {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        List<UUID> cakeIds = cakeRepository.findAllByBirthday(today).stream()
                .map(c -> c.getId())
                .toList();
        if (!cakeIds.isEmpty()) {
            letterRepository.publishLettersByCakeIds(cakeIds);
        }
    }

    @Transactional
    @Scheduled(cron = "${app.scheduler.letter-cleanup-cron}")
    public void cleanupExpiredLetters() {
        OffsetDateTime threshold = OffsetDateTime.now().minusDays(14);
        letterRepository.deleteExpiredUnsavedLetters(threshold);
    }
}
