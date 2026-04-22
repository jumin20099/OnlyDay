package com.onlyday.birthday.domain.unlock;

import com.onlyday.birthday.domain.cake.Cake;
import com.onlyday.birthday.domain.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "cake_unlock_states",
        uniqueConstraints = @UniqueConstraint(name = "uk_cake_rule", columnNames = {"cake_id", "rule_id"}))
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CakeUnlockState extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cake_id", nullable = false)
    private Cake cake;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rule_id", nullable = false)
    private UnlockRule rule;

    @Column(name = "unlocked", nullable = false)
    private boolean unlocked;

    @Column(name = "unlocked_at")
    private OffsetDateTime unlockedAt;

    @Builder
    public CakeUnlockState(Cake cake, UnlockRule rule, boolean unlocked, OffsetDateTime unlockedAt) {
        this.cake = cake;
        this.rule = rule;
        this.unlocked = unlocked;
        this.unlockedAt = unlockedAt;
    }

    public void unlockNow(OffsetDateTime now) {
        this.unlocked = true;
        this.unlockedAt = now;
    }
}
