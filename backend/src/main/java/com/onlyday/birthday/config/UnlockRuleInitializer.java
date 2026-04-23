package com.onlyday.birthday.config;

import com.onlyday.birthday.domain.unlock.UnlockFeatureKeys;
import com.onlyday.birthday.domain.unlock.UnlockRule;
import com.onlyday.birthday.repository.UnlockRuleRepository;
import jakarta.annotation.PostConstruct;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UnlockRuleInitializer {

    private final UnlockRuleRepository unlockRuleRepository;

    public UnlockRuleInitializer(UnlockRuleRepository unlockRuleRepository) {
        this.unlockRuleRepository = unlockRuleRepository;
    }

    @PostConstruct
    @Transactional
    public void init() {
        if (unlockRuleRepository.count() > 0) {
            return;
        }
        unlockRuleRepository.saveAll(List.of(
                UnlockRule.builder()
                        .featureKey(UnlockFeatureKeys.TOPPING_SPARKLE)
                        .thresholdCount(5)
                        .description("Sparkle topping enabled")
                        .build(),
                UnlockRule.builder()
                        .featureKey(UnlockFeatureKeys.FANCY_CANDLES)
                        .thresholdCount(15)
                        .description("Fancy candle animations enabled")
                        .build(),
                UnlockRule.builder()
                        .featureKey(UnlockFeatureKeys.GOLDEN_LAYER)
                        .thresholdCount(30)
                        .description("Golden cake layer enabled")
                        .build()
        ));
    }
}
