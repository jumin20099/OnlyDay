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
    void deleteExpiredUnsavedByCakeBirthday_deletesUnsavedAndKeepsSaved() {
        User owner = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .displayName("T")
                .email("t-" + UUID.randomUUID() + "@x.com")
                .passwordHash("h")
                .build());

        LocalDate oldBirth = LocalDate.of(2010, 1, 1);
        OffsetDateTime open = CakeKstTimeWindow.openAtForBirthday(oldBirth);
        OffsetDateTime close = CakeKstTimeWindow.closeAtForBirthday(oldBirth);

        Cake cake1 = cakeRepository.save(Cake.builder()
                .owner(owner)
                .shareToken("tok" + UUID.randomUUID().toString().substring(0, 32))
                .title("c1")
                .flavor(CakeFlavor.CHOCOLATE)
                .birthday(oldBirth)
                .openAt(open)
                .closeAt(close)
                .build());

        Cake cake2 = cakeRepository.save(Cake.builder()
                .owner(owner)
                .shareToken("tok" + UUID.randomUUID().toString().substring(0, 32))
                .title("c2")
                .flavor(CakeFlavor.VANILLA)
                .birthday(oldBirth)
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

        LocalDate cutoff = LocalDate.of(2015, 6, 1);
        int removed = letterRepository.deleteExpiredUnsavedByCakeBirthday(cutoff);
        assertThat(removed).isEqualTo(1);
        assertThat(letterRepository.findById(letter1.getId())).isPresent();
        assertThat(letterRepository.findById(letter2.getId())).isEmpty();
    }

    @Test
    @Transactional
    void deleteExpiredUnsavedByCakeBirthday_deletesAllWhenNotSaved() {
        User owner = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .displayName("T2")
                .email("t2-" + UUID.randomUUID() + "@x.com")
                .passwordHash("h")
                .build());

        LocalDate oldBirth = LocalDate.of(2011, 2, 1);
        OffsetDateTime open = CakeKstTimeWindow.openAtForBirthday(oldBirth);
        OffsetDateTime close = CakeKstTimeWindow.closeAtForBirthday(oldBirth);

        Cake cake = cakeRepository.save(Cake.builder()
                .owner(owner)
                .shareToken("tok" + UUID.randomUUID().toString().substring(0, 32))
                .title("c")
                .flavor(CakeFlavor.MATCHA)
                .birthday(oldBirth)
                .openAt(open)
                .closeAt(close)
                .build());

        Letter l = persistLetter(cake, "x");

        LocalDate cutoff = LocalDate.of(2012, 1, 1);
        int removed = letterRepository.deleteExpiredUnsavedByCakeBirthday(cutoff);
        assertThat(removed).isEqualTo(1);
        assertThat(letterRepository.findById(l.getId())).isEmpty();
    }

    @Test
    @Transactional
    void deleteExpiredUnsavedByCakeBirthday_doesNotDeleteWhenBirthdayAfterCutoff() {
        User owner = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .displayName("T3")
                .email("t3-" + UUID.randomUUID() + "@x.com")
                .passwordHash("h")
                .build());

        LocalDate newBirth = LocalDate.of(2030, 1, 1);
        OffsetDateTime open = CakeKstTimeWindow.openAtForBirthday(newBirth);
        OffsetDateTime close = CakeKstTimeWindow.closeAtForBirthday(newBirth);

        Cake cake = cakeRepository.save(Cake.builder()
                .owner(owner)
                .shareToken("tok" + UUID.randomUUID().toString().substring(0, 32))
                .title("future")
                .flavor(CakeFlavor.STRAWBERRY)
                .birthday(newBirth)
                .openAt(open)
                .closeAt(close)
                .build());

        Letter l = persistLetter(cake, "f");

        LocalDate cutoff = LocalDate.of(2020, 1, 1);
        int removed = letterRepository.deleteExpiredUnsavedByCakeBirthday(cutoff);
        assertThat(removed).isEqualTo(0);
        assertThat(letterRepository.findById(l.getId())).isPresent();
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
