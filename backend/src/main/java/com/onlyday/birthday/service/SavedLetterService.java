package com.onlyday.birthday.service;

import com.onlyday.birthday.domain.letter.Letter;
import com.onlyday.birthday.domain.letter.SavedLetter;
import com.onlyday.birthday.domain.user.User;
import com.onlyday.birthday.dto.letter.LetterDto;
import com.onlyday.birthday.exception.BusinessException;
import com.onlyday.birthday.repository.LetterRepository;
import com.onlyday.birthday.repository.SavedLetterRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SavedLetterService {

    private final SavedLetterRepository savedLetterRepository;
    private final LetterRepository letterRepository;
    private final UserService userService;

    public SavedLetterService(SavedLetterRepository savedLetterRepository,
                              LetterRepository letterRepository,
                              UserService userService) {
        this.savedLetterRepository = savedLetterRepository;
        this.letterRepository = letterRepository;
        this.userService = userService;
    }

    @Transactional
    public void saveLetter(UUID ownerId, UUID letterId) {
        User owner = userService.getOrCreate(ownerId);
        if (savedLetterRepository.findByOwner_IdAndSourceLetterId(ownerId, letterId).isPresent()) {
            return;
        }

        Letter letter = letterRepository.findById(letterId)
                .orElseThrow(() -> new BusinessException("LETTER_NOT_FOUND", "Letter not found", HttpStatus.NOT_FOUND));

        savedLetterRepository.save(SavedLetter.builder()
                .owner(owner)
                .sourceLetterId(letter.getId())
                .nickname(letter.getCandle().getNickname())
                .content(letter.getContent())
                .build());
    }

    @Transactional
    public void removeSavedLetter(UUID ownerId, UUID letterId) {
        savedLetterRepository.findByOwner_IdAndSourceLetterId(ownerId, letterId)
                .ifPresent(savedLetterRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<LetterDto.SavedLetterResponse> getSavedLetters(UUID ownerId) {
        return savedLetterRepository.findAllByOwnerId(ownerId).stream()
                .map(saved -> new LetterDto.SavedLetterResponse(
                        saved.getId(),
                        saved.getSourceLetterId(),
                        saved.getNickname(),
                        saved.getContent(),
                        saved.getCreatedAt()
                ))
                .toList();
    }
}
