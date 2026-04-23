package com.onlyday.birthday.service;

import com.onlyday.birthday.domain.letter.Letter;
import com.onlyday.birthday.dto.candle.CandleDto;
import com.onlyday.birthday.dto.letter.LetterCommandDto;
import com.onlyday.birthday.dto.letter.LetterDto;
import com.onlyday.birthday.exception.BusinessException;
import com.onlyday.birthday.repository.LetterRepository;
import com.onlyday.birthday.time.CakeKstTimeWindow;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LetterFlowService {

    private final CandleLetterService candleLetterService;
    private final SavedLetterService savedLetterService;
    private final LetterRepository letterRepository;
    private final LetterResponseMapper letterResponseMapper;
    private final Clock clock;

    public LetterFlowService(CandleLetterService candleLetterService,
                             SavedLetterService savedLetterService,
                             LetterRepository letterRepository,
                             LetterResponseMapper letterResponseMapper,
                             Clock clock) {
        this.candleLetterService = candleLetterService;
        this.savedLetterService = savedLetterService;
        this.letterRepository = letterRepository;
        this.letterResponseMapper = letterResponseMapper;
        this.clock = clock;
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

        if (!letter.getCandle().getCake().getOwner().getId().equals(requesterId)) {
            throw new BusinessException("FORBIDDEN", "You cannot access this letter", HttpStatus.FORBIDDEN);
        }

        var cake = letter.getCandle().getCake();
        if (!CakeKstTimeWindow.isBirthdayTodayKst(clock, cake.getBirthday()) || !letter.isVisible()) {
            throw new BusinessException("LETTER_NOT_VISIBLE", "Letter not visible yet", HttpStatus.FORBIDDEN);
        }

        List<Letter> ordered = letterRepository.findVisibleLettersByCakeId(cake.getId());
        int index = -1;
        for (int i = 0; i < ordered.size(); i++) {
            if (ordered.get(i).getId().equals(letter.getId())) {
                index = i;
                break;
            }
        }
        if (index < 0) {
            throw new BusinessException("LETTER_NOT_FOUND", "Letter not found in visible set", HttpStatus.NOT_FOUND);
        }

        int candleCount = cake.getCandleCount();
        return letterResponseMapper.toLockedAwareResponse(letter, index, candleCount);
    }
}
