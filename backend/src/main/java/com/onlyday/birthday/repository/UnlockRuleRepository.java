package com.onlyday.birthday.repository;

import com.onlyday.birthday.domain.unlock.UnlockRule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnlockRuleRepository extends JpaRepository<UnlockRule, Long> {
}
