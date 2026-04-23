package com.onlyday.birthday.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.onlyday.birthday.domain.cake.Cake;
import com.onlyday.birthday.domain.cake.CakeFlavor;
import com.onlyday.birthday.domain.candle.Candle;
import com.onlyday.birthday.domain.letter.Letter;
import com.onlyday.birthday.domain.user.User;
import com.onlyday.birthday.service.LetterContentUnlockPolicy;
import com.onlyday.birthday.support.AbstractJpaPostgresIT;
import com.onlyday.birthday.time.CakeKstTimeWindow;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

/**
 * 가시 편지 생성일 순서 + {@link LetterContentUnlockPolicy} (플랜 11·23).
 */
class LetterOrderAndUnlockPolicyIT extends AbstractJpaPostgresIT {

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
    void visibleLetters_orderMatchesUnlockPolicy() {
        User owner = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .displayName("O")
                .email("order-unlock-" + UUID.randomUUID() + "@x.com")
                .passwordHash("h")
                .build());

        LocalDate birth = LocalDate.of(2028, 1, 1);
        OffsetDateTime open = CakeKstTimeWindow.openAtForBirthday(birth);
        OffsetDateTime close = CakeKstTimeWindow.closeAtForBirthday(birth);

        Cake cake = cakeRepository.save(Cake.builder()
                .owner(owner)
                .shareToken("tok" + UUID.randomUUID().toString().substring(0, 32))
                .title("C")
                .flavor(CakeFlavor.VANILLA)
                .birthday(birth)
                .openAt(open)
                .closeAt(close)
                .build());

        Letter first = persistVisibleLetter(cake, "first");
        Letter second = persistVisibleLetter(cake, "second");

        List<Letter> ordered = letterRepository.findVisibleLettersByCakeId(cake.getId());
        assertThat(ordered).hasSize(2);
        assertThat(ordered.get(0).getId()).isEqualTo(first.getId());
        assertThat(ordered.get(1).getId()).isEqualTo(second.getId());

        LetterContentUnlockPolicy policy = new LetterContentUnlockPolicy(1);
        assertThat(policy.isContentUnlocked(0, 1)).isTrue();
        assertThat(policy.isContentUnlocked(1, 1)).isFalse();
        assertThat(policy.isContentUnlocked(1, 2)).isTrue();
    }

    private Letter persistVisibleLetter(Cake cake, String content) {
        Candle c = candleRepository.save(Candle.builder()
                .cake(cake)
                .nickname("n")
                .positionX(0)
                .positionY(0)
                .candleColor("#000")
                .candleStyle("a")
                .build());
        return letterRepository.save(Letter.builder()
                .candle(c)
                .content(content)
                .imageUrl(null)
                .visible(true)
                .build());
    }
}
