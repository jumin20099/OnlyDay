package com.onlyday.birthday.repository;

import com.onlyday.birthday.domain.cake.Cake;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CakeRepository extends JpaRepository<Cake, UUID> {

    Optional<Cake> findByShareToken(String shareToken);

    @Query("select c from Cake c join fetch c.owner where c.id = :cakeId")
    Optional<Cake> findByIdWithOwner(@Param("cakeId") UUID cakeId);

    @Query("select c from Cake c where c.owner.id = :ownerId order by c.createdAt desc")
    List<Cake> findAllByOwnerId(@Param("ownerId") UUID ownerId);

    @Query("select c from Cake c where month(c.birthday) = :month and day(c.birthday) = :day")
    List<Cake> findAllByBirthdayMonthAndDay(@Param("month") int month, @Param("day") int day);
}
