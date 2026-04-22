package com.onlyday.birthday.domain.unlock;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "unlock_rules")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UnlockRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "feature_key", nullable = false, unique = true, length = 60)
    private String featureKey;

    @Column(name = "threshold_count", nullable = false)
    private int thresholdCount;

    @Column(name = "description", nullable = false, length = 200)
    private String description;

    @Builder
    public UnlockRule(String featureKey, int thresholdCount, String description) {
        this.featureKey = featureKey;
        this.thresholdCount = thresholdCount;
        this.description = description;
    }
}
