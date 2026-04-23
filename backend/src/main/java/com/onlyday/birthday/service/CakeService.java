package com.onlyday.birthday.service;

import com.onlyday.birthday.domain.cake.Cake;
import com.onlyday.birthday.domain.user.User;
import com.onlyday.birthday.dto.cake.CakeDto;
import com.onlyday.birthday.exception.BusinessException;
import com.onlyday.birthday.repository.CakeRepository;
import com.onlyday.birthday.time.CakeKstTimeWindow;
import java.security.SecureRandom;
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
    private final UserService userService;

    public CakeService(CakeRepository cakeRepository, UserService userService) {
        this.cakeRepository = cakeRepository;
        this.userService = userService;
    }

    @Transactional
    public CakeDto.CakeSummary createCake(UUID ownerId, CakeDto.CreateRequest request) {
        User owner = userService.getById(ownerId);
        LocalDate birthday = request.birthday();
        OffsetDateTime openAt = CakeKstTimeWindow.openAtForBirthday(birthday);
        OffsetDateTime closeAt = CakeKstTimeWindow.closeAtForBirthday(birthday);
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
        OffsetDateTime openAt = CakeKstTimeWindow.openAtForBirthday(birthday);
        OffsetDateTime closeAt = CakeKstTimeWindow.closeAtForBirthday(birthday);
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
        return new CakeDto.CakeSummary(
                cake.getId(),
                cake.getTitle(),
                cake.getFlavor(),
                cake.getShareToken(),
                cake.getBirthday(),
                cake.getOpenAt(),
                cake.getCloseAt(),
                cake.getCandleCount(),
                cake.getCakeImageUrl()
        );
    }
}
