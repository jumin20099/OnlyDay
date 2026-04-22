package com.onlyday.birthday.repository;

import com.onlyday.birthday.domain.letter.SavedLetter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SavedLetterRepository extends JpaRepository<SavedLetter, UUID> {

    @Query("select s from SavedLetter s where s.owner.id = :ownerId order by s.createdAt desc")
    List<SavedLetter> findAllByOwnerId(@Param("ownerId") UUID ownerId);

    Optional<SavedLetter> findByOwner_IdAndSourceLetterId(UUID ownerId, UUID sourceLetterId);
}
