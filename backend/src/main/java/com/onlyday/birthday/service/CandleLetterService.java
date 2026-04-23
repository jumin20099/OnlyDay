package com.onlyday.birthday.service;

import com.onlyday.birthday.domain.cake.Cake;
import com.onlyday.birthday.domain.candle.Candle;
import com.onlyday.birthday.domain.letter.Letter;
import com.onlyday.birthday.dto.candle.CandleDto;
import com.onlyday.birthday.dto.letter.LetterDto;
import com.onlyday.birthday.exception.BusinessException;
import com.onlyday.birthday.repository.CandleRepository;
import com.onlyday.birthday.repository.LetterRepository;
import com.onlyday.birthday.time.CakeKstTimeWindow;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CandleLetterService {

    private final CakeService cakeService;
    private final CandleRepository candleRepository;
    private final LetterRepository letterRepository;
    private final UnlockService unlockService;
    private final LetterResponseMapper letterResponseMapper;
    private final Clock clock;

    public CandleLetterService(CakeService cakeService,
                               CandleRepository candleRepository,
                               LetterRepository letterRepository,
                               UnlockService unlockService,
                               LetterResponseMapper letterResponseMapper,
                               Clock clock) {
        this.cakeService = cakeService;
        this.candleRepository = candleRepository;
        this.letterRepository = letterRepository;
        this.unlockService = unlockService;
        this.letterResponseMapper = letterResponseMapper;
        this.clock = clock;
    }

    @Transactional
    public CandleDto.CandleResponse addCandleWithLetter(String shareToken, CandleDto.AddCandleWithLetterRequest request) {
        Cake cake = cakeService.getCakeEntityByShareToken(shareToken);
        validateWriteWindow(cake);

        Candle candle = candleRepository.save(Candle.builder()
                .cake(cake)
                .nickname(request.nickname())
                .positionX(request.positionX())
                .positionY(request.positionY())
                .candleColor(request.candleColor())
                .candleStyle(request.candleStyle())
                .build());

        letterRepository.save(Letter.builder()
                .candle(candle)
                .content(request.letterContent())
                .imageUrl(request.letterImageUrl())
                .visible(false)
                .build());

        cake.incrementCandleCount();
        synchronizeCandleCount(cake);
        unlockService.evaluateUnlocks(cake);

        return new CandleDto.CandleResponse(
                candle.getId(),
                candle.getNickname(),
                candle.getPositionX(),
                candle.getPositionY(),
                candle.getCandleColor(),
                candle.getCandleStyle()
        );
    }

    @Transactional(readOnly = true)
    public List<CandleDto.CandleResponse> getCandles(UUID cakeId) {
        return candleRepository.findAllByCakeId(cakeId).stream()
                .map(c -> new CandleDto.CandleResponse(
                        c.getId(), c.getNickname(), c.getPositionX(), c.getPositionY(), c.getCandleColor(), c.getCandleStyle()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LetterDto.LetterResponse> getVisibleLetters(UUID requesterId, UUID cakeId) {
        Cake cake = cakeService.getCakeEntity(cakeId);
        if (!cake.getOwner().getId().equals(requesterId)) {
            throw new BusinessException("FORBIDDEN", "Only cake owner can view letters", HttpStatus.FORBIDDEN);
        }

        if (!CakeKstTimeWindow.isBirthdayTodayKst(clock, cake.getBirthday())) {
            throw new BusinessException("LETTER_NOT_VISIBLE", "Letters can be viewed only on birthday (KST)", HttpStatus.FORBIDDEN);
        }

        List<Letter> letters = letterRepository.findVisibleLettersByCakeId(cakeId);
        int candleCount = cake.getCandleCount();
        return IntStream.range(0, letters.size())
                .mapToObj(i -> letterResponseMapper.toLockedAwareResponse(letters.get(i), i, candleCount))
                .toList();
    }

    private void validateWriteWindow(Cake cake) {
        if (!CakeKstTimeWindow.isWithinWriteWindow(clock, cake.getOpenAt(), cake.getCloseAt())) {
            throw new BusinessException("WRITE_WINDOW_CLOSED", "Letter writing is not allowed at this time", HttpStatus.BAD_REQUEST);
        }
    }

    private void synchronizeCandleCount(Cake cake) {
        int actual = (int) candleRepository.countByCake_Id(cake.getId());
        cake.setCandleCount(actual);
    }
}
