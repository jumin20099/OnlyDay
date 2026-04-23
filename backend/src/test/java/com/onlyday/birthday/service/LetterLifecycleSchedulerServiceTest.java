package com.onlyday.birthday.service;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.onlyday.birthday.repository.CakeRepository;
import com.onlyday.birthday.repository.LetterRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LetterLifecycleSchedulerServiceTest {

    @Mock
    private CakeRepository cakeRepository;

    @Mock
    private LetterRepository letterRepository;

    private LetterLifecycleSchedulerService service;

    @BeforeEach
    void setUp() {
        // 2026-04-23 15:00 UTC = 2026-04-24 00:00 KST
        Clock clock = Clock.fixed(Instant.parse("2026-04-23T15:00:00Z"), ZoneId.of("UTC"));
        service = new LetterLifecycleSchedulerService(cakeRepository, letterRepository, clock, 14);
    }

    @Test
    void cleanup_usesKstDateForCutoff() {
        when(letterRepository.deleteExpiredUnsavedByCakeBirthday(
                LocalDate.of(2026, 4, 10)))
                .thenReturn(0);
        service.cleanupExpiredLetters();
        verify(letterRepository).deleteExpiredUnsavedByCakeBirthday(
                eq(LocalDate.of(2026, 4, 10)));
    }

    @Test
    void publish_asksRepositoryForTodaysBirthdayInKst() {
        when(cakeRepository.findAllByBirthday(LocalDate.of(2026, 4, 24)))
                .thenReturn(List.of());
        service.publishLettersOnBirthday();
        verify(cakeRepository).findAllByBirthday(
                LocalDate.of(2026, 4, 24));
    }
}
