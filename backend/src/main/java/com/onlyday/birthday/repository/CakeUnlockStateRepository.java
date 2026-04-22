package com.onlyday.birthday.repository;

import com.onlyday.birthday.domain.unlock.CakeUnlockState;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CakeUnlockStateRepository extends JpaRepository<CakeUnlockState, UUID> {

    Optional<CakeUnlockState> findByCake_IdAndRule_Id(UUID cakeId, Long ruleId);

    List<CakeUnlockState> findAllByCake_Id(UUID cakeId);
}
