package com.onlyday.birthday.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.onlyday.birthday.domain.cake.Cake;
import com.onlyday.birthday.domain.cake.CakeFlavor;
import com.onlyday.birthday.domain.candle.Candle;
import com.onlyday.birthday.domain.letter.Letter;
import com.onlyday.birthday.domain.user.User;
import com.onlyday.birthday.support.AbstractJpaPostgresIT;
import com.onlyday.birthday.time.CakeKstTimeWindow;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

/**
 * 촛불+편지 단일 트랜잭션 영속성(플랜 23).
 */
class CandleLetterPersistenceIT extends AbstractJpaPostgresIT {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CakeRepository cakeRepository;

    @Autowired
    private CandleRepository candleRepository;

    @Autowired
    private LetterRepository letterRepository;

    @Test
    @Transactional
    void candleAndLetter_persistedAndLinked() {
        User owner = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .displayName("O")
                .email("candle-it-" + UUID.randomUUID() + "@x.com")
                .passwordHash("h")
                .build());

        LocalDate birth = LocalDate.of(2027, 6, 1);
        OffsetDateTime open = CakeKstTimeWindow.openAtForBirthday(birth);
        OffsetDateTime close = CakeKstTimeWindow.closeAtForBirthday(birth);

        Cake cake = cakeRepository.save(Cake.builder()
                .owner(owner)
                .shareToken("tok" + UUID.randomUUID().toString().substring(0, 32))
                .title("T")
                .flavor(CakeFlavor.CHOCOLATE)
                .birthday(birth)
                .openAt(open)
                .closeAt(close)
                .build());

        Candle candle = candleRepository.save(Candle.builder()
                .cake(cake)
                .nickname("guest")
                .positionX(0.5)
                .positionY(0.5)
                .candleColor("#e0e0e0")
                .candleStyle("spark")
                .build());

        Letter letter = letterRepository.save(Letter.builder()
                .candle(candle)
                .content("hello from IT")
                .imageUrl(null)
                .visible(false)
                .build());

        assertThat(letter.getId()).isNotNull();
        assertThat(letter.getCandle().getId()).isEqualTo(candle.getId());
        assertThat(letterRepository.findById(letter.getId()))
                .isPresent();
        assertThat(letterRepository.findById(letter.getId()).orElseThrow().getContent())
                .isEqualTo("hello from IT");
    }
}
