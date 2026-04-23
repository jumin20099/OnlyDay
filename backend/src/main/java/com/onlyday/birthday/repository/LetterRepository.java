package com.onlyday.birthday.repository;

import com.onlyday.birthday.domain.letter.Letter;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LetterRepository extends JpaRepository<Letter, UUID> {

    @Query("""
            select l from Letter l
            join fetch l.candle c
            where c.cake.id = :cakeId and l.visible = true
            order by l.createdAt asc, l.id asc
            """)
    List<Letter> findVisibleLettersByCakeId(@Param("cakeId") UUID cakeId);

    @Query("""
            select l from Letter l
            join fetch l.candle c
            join fetch c.cake ck
            where l.id = :letterId
            """)
    Optional<Letter> findByIdWithCake(@Param("letterId") UUID letterId);

    @Modifying
    @Query("""
            update Letter l
            set l.visible = true
            where l.candle.cake.id in :cakeIds and l.visible = false
            """)
    int publishLettersByCakeIds(@Param("cakeIds") List<UUID> cakeIds);

    /**
     * KST 기준: 말소일 = (생일 + 14일)이 **지난** 케이크의 편지. ({@code birthday < todayKst - 14})
     * 보관함(SavedLetter)에 있는 sourceLetterId 는 제외.
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            delete from Letter l
            where l.candle.cake.birthday < :cutoffBirthday
            and l.id not in (select s.sourceLetterId from SavedLetter s)
            """)
    int deleteExpiredUnsavedByCakeBirthday(@Param("cutoffBirthday") LocalDate cutoffBirthday);
}
