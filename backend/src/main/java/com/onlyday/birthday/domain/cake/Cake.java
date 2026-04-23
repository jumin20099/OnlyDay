package com.onlyday.birthday.domain.cake;

import com.onlyday.birthday.domain.common.BaseTimeEntity;
import com.onlyday.birthday.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "cakes", indexes = {
        @Index(name = "idx_cake_owner_created", columnList = "owner_id,created_at"),
        @Index(name = "idx_cake_share_token", columnList = "share_token", unique = true),
        @Index(name = "idx_cake_open_close", columnList = "open_at,close_at"),
        @Index(name = "idx_cake_birthday", columnList = "birthday")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cake extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "share_token", nullable = false, unique = true, length = 40)
    private String shareToken;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "flavor", nullable = false, length = 30)
    private CakeFlavor flavor;

    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

    @Column(name = "open_at", nullable = false)
    private OffsetDateTime openAt;

    @Column(name = "close_at", nullable = false)
    private OffsetDateTime closeAt;

    @Column(name = "candle_count", nullable = false)
    private int candleCount;

    /** Supabase Storage 등에 올린 완성/미리보기 케이크 이미지(선택). */
    @Column(name = "cake_image_url", length = 2000)
    private String cakeImageUrl;

    @Builder
    public Cake(User owner, String shareToken, String title, CakeFlavor flavor,
                LocalDate birthday, OffsetDateTime openAt, OffsetDateTime closeAt) {
        this.owner = owner;
        this.shareToken = shareToken;
        this.title = title;
        this.flavor = flavor;
        this.birthday = birthday;
        this.openAt = openAt;
        this.closeAt = closeAt;
        this.candleCount = 0;
    }

    public void update(String title, CakeFlavor flavor, LocalDate birthday, OffsetDateTime openAt, OffsetDateTime closeAt) {
        this.title = title;
        this.flavor = flavor;
        this.birthday = birthday;
        this.openAt = openAt;
        this.closeAt = closeAt;
    }

    public void setCakeImageUrl(String cakeImageUrl) {
        this.cakeImageUrl = cakeImageUrl;
    }

    public void incrementCandleCount() {
        this.candleCount++;
    }

    public void setCandleCount(int candleCount) {
        this.candleCount = candleCount;
    }
}
