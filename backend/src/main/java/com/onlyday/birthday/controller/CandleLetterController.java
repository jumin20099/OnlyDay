package com.onlyday.birthday.controller;

import com.onlyday.birthday.api.ApiResponse;
import com.onlyday.birthday.dto.candle.CandleDto;
import com.onlyday.birthday.dto.letter.LetterDto;
import com.onlyday.birthday.dto.unlock.UnlockDto;
import com.onlyday.birthday.security.SecurityUtils;
import com.onlyday.birthday.service.CakeService;
import com.onlyday.birthday.service.CandleLetterService;
import com.onlyday.birthday.service.UnlockService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cakes")
public class CandleLetterController {

    private final CandleLetterService candleLetterService;
    private final CakeService cakeService;
    private final UnlockService unlockService;

    public CandleLetterController(CandleLetterService candleLetterService,
                                  CakeService cakeService,
                                  UnlockService unlockService) {
        this.candleLetterService = candleLetterService;
        this.cakeService = cakeService;
        this.unlockService = unlockService;
    }

    @PostMapping("/{shareToken}/candles")
    public ApiResponse<CandleDto.CandleResponse> addCandleWithLetter(
            @PathVariable String shareToken,
            @Valid @RequestBody CandleDto.AddCandleWithLetterRequest request
    ) {
        var author = SecurityUtils.currentUserOptional()
                .map(u -> u.userId())
                .orElse(null);
        return ApiResponse.ok(candleLetterService.addCandleWithLetter(author, shareToken, request));
    }

    @GetMapping("/{cakeId}/candles")
    public ApiResponse<List<CandleDto.CandleResponse>> getCandles(@PathVariable UUID cakeId) {
        return ApiResponse.ok(candleLetterService.getCandles(cakeId));
    }

    @GetMapping("/{cakeId}/letters")
    public ApiResponse<List<LetterDto.LetterResponse>> getLetters(@PathVariable UUID cakeId) {
        return ApiResponse.ok(candleLetterService.getVisibleLetters(SecurityUtils.currentUser().userId(), cakeId));
    }

    @GetMapping("/{cakeId}/unlock-states")
    public ApiResponse<List<UnlockDto.UnlockStateResponse>> unlockStates(@PathVariable UUID cakeId) {
        return ApiResponse.ok(unlockService.getUnlockStates(cakeService.getCakeEntity(cakeId)));
    }
}
