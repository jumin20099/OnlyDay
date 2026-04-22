package com.onlyday.birthday.repository;

import com.onlyday.birthday.domain.letter.Letter;
import java.time.OffsetDateTime;
import java.util.List;
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
            order by l.createdAt asc
            """)
    List<Letter> findVisibleLettersByCakeId(@Param("cakeId") UUID cakeId);

    @Modifying
    @Query("""
            update Letter l
            set l.visible = true
            where l.candle.cake.id in :cakeIds and l.visible = false
            """)
    int publishLettersByCakeIds(@Param("cakeIds") List<UUID> cakeIds);

    @Modifying
    @Query("""
            delete from Letter l
            where l.createdAt < :threshold
            and l.id not in (select s.sourceLetterId from SavedLetter s)
            """)
    int deleteExpiredUnsavedLetters(@Param("threshold") OffsetDateTime threshold);
}
