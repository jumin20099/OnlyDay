package com.onlyday.birthday.service;

import com.onlyday.birthday.domain.cake.Cake;
import com.onlyday.birthday.domain.user.User;
import com.onlyday.birthday.dto.cake.CakeDto;
import com.onlyday.birthday.exception.BusinessException;
import com.onlyday.birthday.repository.CakeRepository;
import com.onlyday.birthday.repository.CakeUnlockStateRepository;
import com.onlyday.birthday.repository.CandleRepository;
import com.onlyday.birthday.repository.LetterRepository;
import com.onlyday.birthday.time.CakeKstTimeWindow;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CakeService {

    private static final String TOKEN_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final CakeRepository cakeRepository;
    private final LetterRepository letterRepository;
    private final CandleRepository candleRepository;
    private final CakeUnlockStateRepository cakeUnlockStateRepository;
    private final UserService userService;
    private final Clock clock;

    public CakeService(
            CakeRepository cakeRepository,
            LetterRepository letterRepository,
            CandleRepository candleRepository,
            CakeUnlockStateRepository cakeUnlockStateRepository,
            UserService userService,
            Clock clock) {
        this.cakeRepository = cakeRepository;
        this.letterRepository = letterRepository;
        this.candleRepository = candleRepository;
        this.cakeUnlockStateRepository = cakeUnlockStateRepository;
        this.userService = userService;
        this.clock = clock;
    }

    @Transactional
    public CakeDto.CakeSummary createCake(UUID ownerId, CakeDto.CreateRequest request) {
        User owner = userService.getById(ownerId);
        LocalDate birthday = request.birthday();
        CakeKstTimeWindow.TimeWindow w = CakeKstTimeWindow.currentWriteWindowForPersistence(clock, birthday);
        OffsetDateTime openAt = w.openAt();
        OffsetDateTime closeAt = w.closeAt();
        validateComputedWindow(openAt, closeAt);

        Cake cake = cakeRepository.save(Cake.builder()
                .owner(owner)
                .shareToken(generateToken())
                .title(request.title())
                .flavor(request.flavor())
                .birthday(birthday)
                .openAt(openAt)
                .closeAt(closeAt)
                .build());
        return toSummary(cake);
    }

    @Transactional(readOnly = true)
    public CakeDto.CakeSummary getByShareToken(String shareToken) {
        Cake cake = cakeRepository.findByShareToken(shareToken)
                .orElseThrow(() -> new BusinessException("CAKE_NOT_FOUND", "Cake not found", HttpStatus.NOT_FOUND));
        return toSummary(cake);
    }

    @Transactional(readOnly = true)
    public List<CakeDto.CakeSummary> getMyCakes(UUID ownerId) {
        return cakeRepository.findAllByOwnerId(ownerId).stream()
                .map(this::toSummary)
                .toList();
    }

    @Transactional
    public CakeDto.CakeSummary updateCake(UUID ownerId, UUID cakeId, CakeDto.UpdateRequest request) {
        Cake cake = cakeRepository.findById(cakeId)
                .orElseThrow(() -> new BusinessException("CAKE_NOT_FOUND", "Cake not found", HttpStatus.NOT_FOUND));
        validateOwner(cake, ownerId);
        LocalDate birthday = request.birthday();
        CakeKstTimeWindow.TimeWindow w = CakeKstTimeWindow.currentWriteWindowForPersistence(clock, birthday);
        OffsetDateTime openAt = w.openAt();
        OffsetDateTime closeAt = w.closeAt();
        validateComputedWindow(openAt, closeAt);
        cake.update(request.title(), request.flavor(), birthday, openAt, closeAt);
        if (request.cakeImageUrl() != null) {
            String u = request.cakeImageUrl().trim();
            cake.setCakeImageUrl(u.isEmpty() ? null : u);
        }
        return toSummary(cake);
    }

    @Transactional
    public void deleteCake(UUID ownerId, UUID cakeId) {
        Cake cake = cakeRepository.findById(cakeId)
                .orElseThrow(() -> new BusinessException("CAKE_NOT_FOUND", "Cake not found", HttpStatus.NOT_FOUND));
        validateOwner(cake, ownerId);
        // letters → candles → unlock rows 순으로 제거해야 FK 제약(23503)으로 삭제가 실패하지 않음
        letterRepository.deleteAllByCakeId(cakeId);
        candleRepository.deleteAllByCakeId(cakeId);
        cakeUnlockStateRepository.deleteAllByCakeId(cakeId);
        cakeRepository.delete(cake);
    }

    @Transactional(readOnly = true)
    public Cake getCakeEntityByShareToken(String shareToken) {
        return cakeRepository.findByShareToken(shareToken)
                .orElseThrow(() -> new BusinessException("CAKE_NOT_FOUND", "Cake not found", HttpStatus.NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public Cake getCakeEntity(UUID cakeId) {
        return cakeRepository.findById(cakeId)
                .orElseThrow(() -> new BusinessException("CAKE_NOT_FOUND", "Cake not found", HttpStatus.NOT_FOUND));
    }

    private void validateOwner(Cake cake, UUID ownerId) {
        if (!cake.getOwner().getId().equals(ownerId)) {
            throw new BusinessException("FORBIDDEN", "You are not owner of this cake", HttpStatus.FORBIDDEN);
        }
    }

    private String generateToken() {
        String candidate;
        do {
            StringBuilder sb = new StringBuilder(16);
            for (int i = 0; i < 16; i++) {
                sb.append(TOKEN_CHARS.charAt(RANDOM.nextInt(TOKEN_CHARS.length())));
            }
            candidate = sb.toString();
        } while (cakeRepository.findByShareToken(candidate).isPresent());
        return candidate;
    }

    private void validateComputedWindow(OffsetDateTime openAt, OffsetDateTime closeAt) {
        if (!openAt.isBefore(closeAt)) {
            throw new BusinessException("INVALID_TIME_WINDOW", "openAt must be before closeAt", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private CakeDto.CakeSummary toSummary(Cake cake) {
        CakeKstTimeWindow.TimeWindow w = CakeKstTimeWindow.openCloseForDisplay(clock, cake.getBirthday());
        return new CakeDto.CakeSummary(
                cake.getId(),
                cake.getTitle(),
                cake.getFlavor(),
                cake.getShareToken(),
                cake.getOwner().getId(),
                cake.getBirthday(),
                w.openAt(),
                w.closeAt(),
                cake.getCandleCount(),
                cake.getCakeImageUrl()
        );
    }
}
