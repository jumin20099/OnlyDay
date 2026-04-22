package com.onlyday.birthday.service;

import com.onlyday.birthday.domain.cake.Cake;
import com.onlyday.birthday.domain.unlock.CakeUnlockState;
import com.onlyday.birthday.domain.unlock.UnlockRule;
import com.onlyday.birthday.dto.unlock.UnlockDto;
import com.onlyday.birthday.repository.CakeUnlockStateRepository;
import com.onlyday.birthday.repository.UnlockRuleRepository;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UnlockService {

    private final UnlockRuleRepository unlockRuleRepository;
    private final CakeUnlockStateRepository cakeUnlockStateRepository;

    public UnlockService(UnlockRuleRepository unlockRuleRepository,
                         CakeUnlockStateRepository cakeUnlockStateRepository) {
        this.unlockRuleRepository = unlockRuleRepository;
        this.cakeUnlockStateRepository = cakeUnlockStateRepository;
    }

    @Transactional
    public void evaluateUnlocks(Cake cake) {
        List<UnlockRule> rules = unlockRuleRepository.findAll();
        for (UnlockRule rule : rules) {
            CakeUnlockState state = cakeUnlockStateRepository.findByCake_IdAndRule_Id(cake.getId(), rule.getId())
                    .orElseGet(() -> cakeUnlockStateRepository.save(CakeUnlockState.builder()
                            .cake(cake)
                            .rule(rule)
                            .unlocked(false)
                            .build()));

            if (!state.isUnlocked() && cake.getCandleCount() >= rule.getThresholdCount()) {
                state.unlockNow(OffsetDateTime.now());
            }
        }
    }

    @Transactional(readOnly = true)
    public List<UnlockDto.UnlockStateResponse> getUnlockStates(Cake cake) {
        return cakeUnlockStateRepository.findAllByCake_Id(cake.getId()).stream()
                .map(state -> new UnlockDto.UnlockStateResponse(
                        state.getRule().getFeatureKey(),
                        state.getRule().getThresholdCount(),
                        state.isUnlocked()
                ))
                .toList();
    }
}
