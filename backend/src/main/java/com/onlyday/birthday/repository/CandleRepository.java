package com.onlyday.birthday.repository;

import com.onlyday.birthday.domain.candle.Candle;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CandleRepository extends JpaRepository<Candle, UUID> {

    @Query("select c from Candle c where c.cake.id = :cakeId order by c.createdAt asc")
    List<Candle> findAllByCakeId(@Param("cakeId") UUID cakeId);

    long countByCake_Id(UUID cakeId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from Candle c where c.cake.id = :cakeId")
    void deleteAllByCakeId(@Param("cakeId") UUID cakeId);
}
