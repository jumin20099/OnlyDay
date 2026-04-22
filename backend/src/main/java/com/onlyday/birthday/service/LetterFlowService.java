package com.onlyday.birthday.service;

import com.onlyday.birthday.domain.letter.Letter;
import com.onlyday.birthday.dto.candle.CandleDto;
import com.onlyday.birthday.dto.letter.LetterCommandDto;
import com.onlyday.birthday.dto.letter.LetterDto;
import com.onlyday.birthday.exception.BusinessException;
import com.onlyday.birthday.repository.LetterRepository;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LetterFlowService {

    private final CandleLetterService candleLetterService;
    private final SavedLetterService savedLetterService;
    private final LetterRepository letterRepository;

    public LetterFlowService(CandleLetterService candleLetterService,
                             SavedLetterService savedLetterService,
                             LetterRepository letterRepository) {
        this.candleLetterService = candleLetterService;
        this.savedLetterService = savedLetterService;
        this.letterRepository = letterRepository;
    }

    @Transactional
    public CandleDto.CandleResponse createLetterWithCandle(LetterCommandDto.CreateLetterRequest request) {
        return candleLetterService.addCandleWithLetter(
                request.cakeShareToken(),
                new CandleDto.AddCandleWithLetterRequest(
                        request.nickname(),
                        request.positionX(),
                        request.positionY(),
                        request.candleColor(),
                        request.candleStyle(),
                        request.content(),
                        request.imageUrl()
                )
        );
    }

    @Transactional
    public void saveLetter(UUID ownerId, UUID letterId) {
        savedLetterService.saveLetter(ownerId, letterId);
    }

    @Transactional(readOnly = true)
    public LetterDto.LetterResponse getLetter(UUID requesterId, UUID letterId) {
        Letter letter = letterRepository.findByIdWithCake(letterId)
                .orElseThrow(() -> new BusinessException("LETTER_NOT_FOUND", "Letter not found", HttpStatus.NOT_FOUND));

        boolean owner = letter.getCandle().getCake().getOwner().getId().equals(requesterId);
        if (!owner) {
            throw new BusinessException("FORBIDDEN", "You cannot access this letter", HttpStatus.FORBIDDEN);
        }

        boolean birthdayToday = letter.getCandle().getCake().getBirthday().equals(LocalDate.now(ZoneOffset.UTC));
        if (!birthdayToday || !letter.isVisible()) {
            throw new BusinessException("LETTER_NOT_VISIBLE", "Letter not visible yet", HttpStatus.FORBIDDEN);
        }

        return new LetterDto.LetterResponse(
                letter.getId(),
                letter.getCandle().getId(),
                letter.getCandle().getNickname(),
                letter.getContent(),
                letter.getImageUrl(),
                true,
                letter.getCreatedAt()
        );
    }
}
