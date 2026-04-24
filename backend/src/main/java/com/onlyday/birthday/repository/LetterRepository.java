package com.onlyday.birthday.repository;

import com.onlyday.birthday.domain.letter.Letter;
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

    /** 생일 당일 케이크 주인 열람용(스케줄러로 published 되기 전 편지도 포함). */
    @Query("""
            select l from Letter l
            join fetch l.candle c
            where c.cake.id = :cakeId
            order by l.createdAt asc, l.id asc
            """)
    List<Letter> findAllLettersByCakeId(@Param("cakeId") UUID cakeId);

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

    @Query("""
            select l from Letter l
            join fetch l.candle c
            join fetch c.cake k
            where l.id not in (select s.sourceLetterId from SavedLetter s)
            """)
    List<Letter> findLettersNotInSaved();

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from Letter l where l.candle.cake.id = :cakeId")
    void deleteAllByCakeId(@Param("cakeId") UUID cakeId);
}
