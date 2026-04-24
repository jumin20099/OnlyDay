package com.onlyday.birthday.repository;

import com.onlyday.birthday.domain.unlock.CakeUnlockState;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CakeUnlockStateRepository extends JpaRepository<CakeUnlockState, UUID> {

    Optional<CakeUnlockState> findByCake_IdAndRule_Id(UUID cakeId, Long ruleId);

    List<CakeUnlockState> findAllByCake_Id(UUID cakeId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from CakeUnlockState s where s.cake.id = :cakeId")
    void deleteAllByCakeId(@Param("cakeId") UUID cakeId);
}
