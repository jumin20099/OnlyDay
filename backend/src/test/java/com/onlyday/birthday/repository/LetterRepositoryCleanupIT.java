package com.onlyday.birthday.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.onlyday.birthday.domain.cake.Cake;
import com.onlyday.birthday.domain.cake.CakeFlavor;
import com.onlyday.birthday.domain.candle.Candle;
import com.onlyday.birthday.domain.letter.Letter;
import com.onlyday.birthday.domain.letter.SavedLetter;
import com.onlyday.birthday.domain.user.User;
import com.onlyday.birthday.support.AbstractJpaPostgresIT;
import com.onlyday.birthday.time.CakeKstTimeWindow;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

class LetterRepositoryCleanupIT extends AbstractJpaPostgresIT {

    @Autowired
    private LetterRepository letterRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CakeRepository cakeRepository;

    @Autowired
    private CandleRepository candleRepository;

    @Autowired
    private SavedLetterRepository savedLetterRepository;

    @Test
    @Transactional
    void retention_deletesUnsavedAndKeepsSaved() {
        User owner = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .displayName("T")
                .email("t-" + UUID.randomUUID() + "@x.com")
                .passwordHash("h")
                .build());

        LocalDate birth = LocalDate.of(2000, 1, 1);
        OffsetDateTime open = CakeKstTimeWindow.openAtForBirthday(birth);
        OffsetDateTime close = CakeKstTimeWindow.closeAtForBirthday(birth);

        Cake cake1 = cakeRepository.save(Cake.builder()
                .owner(owner)
                .shareToken("tok" + UUID.randomUUID().toString().substring(0, 32))
                .title("c1")
                .flavor(CakeFlavor.CHOCOLATE)
                .birthday(birth)
                .openAt(open)
                .closeAt(close)
                .build());

        Cake cake2 = cakeRepository.save(Cake.builder()
                .owner(owner)
                .shareToken("tok" + UUID.randomUUID().toString().substring(0, 32))
                .title("c2")
                .flavor(CakeFlavor.VANILLA)
                .birthday(birth)
                .openAt(open)
                .closeAt(close)
                .build());

        Letter letter1 = persistLetter(cake1, "a");
        Letter letter2 = persistLetter(cake2, "b");

        savedLetterRepository.save(SavedLetter.builder()
                .owner(owner)
                .sourceLetterId(letter1.getId())
                .nickname("n")
                .content("c")
                .build());

        LocalDate todayKst = LocalDate.of(2015, 6, 1);
        int removed = applyRetentionCleanup(todayKst, 14);
        assertThat(removed).isEqualTo(1);
        assertThat(letterRepository.findById(letter1.getId())).isPresent();
        assertThat(letterRepository.findById(letter2.getId())).isEmpty();
    }

    @Test
    @Transactional
    void retention_deletesAllWhenNotSaved() {
        User owner = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .displayName("T2")
                .email("t2-" + UUID.randomUUID() + "@x.com")
                .passwordHash("h")
                .build());

        LocalDate birth = LocalDate.of(2000, 2, 1);
        OffsetDateTime open = CakeKstTimeWindow.openAtForBirthday(birth);
        OffsetDateTime close = CakeKstTimeWindow.closeAtForBirthday(birth);

        Cake cake = cakeRepository.save(Cake.builder()
                .owner(owner)
                .shareToken("tok" + UUID.randomUUID().toString().substring(0, 32))
                .title("c")
                .flavor(CakeFlavor.MATCHA)
                .birthday(birth)
                .openAt(open)
                .closeAt(close)
                .build());

        Letter l = persistLetter(cake, "x");

        LocalDate todayKst = LocalDate.of(2012, 1, 1);
        int removed = applyRetentionCleanup(todayKst, 14);
        assertThat(removed).isEqualTo(1);
        assertThat(letterRepository.findById(l.getId())).isEmpty();
    }

    @Test
    @Transactional
    void retention_doesNotDeleteWhenWithinWindowAfterLastBirthday() {
        User owner = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .displayName("T3")
                .email("t3-" + UUID.randomUUID() + "@x.com")
                .passwordHash("h")
                .build());

        LocalDate birth = LocalDate.of(2000, 1, 1);
        OffsetDateTime open = CakeKstTimeWindow.openAtForBirthday(birth);
        OffsetDateTime close = CakeKstTimeWindow.closeAtForBirthday(birth);

        Cake cake = cakeRepository.save(Cake.builder()
                .owner(owner)
                .shareToken("tok" + UUID.randomUUID().toString().substring(0, 32))
                .title("future")
                .flavor(CakeFlavor.STRAWBERRY)
                .birthday(birth)
                .openAt(open)
                .closeAt(close)
                .build());

        Letter l = persistLetter(cake, "f");

        LocalDate todayKst = LocalDate.of(2020, 1, 10);
        int removed = applyRetentionCleanup(todayKst, 14);
        assertThat(removed).isEqualTo(0);
        assertThat(letterRepository.findById(l.getId())).isPresent();
    }

    private int applyRetentionCleanup(LocalDate todayKst, int retentionDays) {
        int n = 0;
        for (Letter l : letterRepository.findLettersNotInSaved()) {
            if (CakeKstTimeWindow.isRetentionExpired(
                    todayKst, l.getCandle().getCake().getBirthday(), retentionDays)) {
                letterRepository.delete(l);
                n++;
            }
        }
        return n;
    }

    private Letter persistLetter(Cake cake, String content) {
        Candle c = candleRepository.save(Candle.builder()
                .cake(cake)
                .nickname("n")
                .positionX(0)
                .positionY(0)
                .candleColor("#fff")
                .candleStyle("classic")
                .build());
        return letterRepository.save(Letter.builder()
                .candle(c)
                .content(content)
                .imageUrl(null)
                .visible(true)
                .build());
    }
}
