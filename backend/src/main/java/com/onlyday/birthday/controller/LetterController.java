package com.onlyday.birthday.controller;

import com.onlyday.birthday.api.ApiResponse;
import com.onlyday.birthday.dto.candle.CandleDto;
import com.onlyday.birthday.dto.letter.LetterCommandDto;
import com.onlyday.birthday.dto.letter.LetterDto;
import com.onlyday.birthday.security.SecurityUtils;
import com.onlyday.birthday.service.LetterFlowService;
import com.onlyday.birthday.service.SavedLetterService;
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
@RequestMapping("/letters")
public class LetterController {

    private final LetterFlowService letterFlowService;
    private final SavedLetterService savedLetterService;

    public LetterController(LetterFlowService letterFlowService, SavedLetterService savedLetterService) {
        this.letterFlowService = letterFlowService;
        this.savedLetterService = savedLetterService;
    }

    @PostMapping
    public ApiResponse<CandleDto.CandleResponse> createLetter(@Valid @RequestBody LetterCommandDto.CreateLetterRequest request) {
        return ApiResponse.ok(letterFlowService.createLetterWithCandle(request));
    }

    @PostMapping("/{id}/save")
    public ApiResponse<Void> saveLetter(@PathVariable("id") UUID letterId) {
        letterFlowService.saveLetter(SecurityUtils.currentUser().userId(), letterId);
        return ApiResponse.ok(null);
    }

    @GetMapping("/saved")
    public ApiResponse<List<LetterDto.SavedLetterResponse>> getSavedLetters() {
        return ApiResponse.ok(savedLetterService.getSavedLetters(SecurityUtils.currentUser().userId()));
    }

    @GetMapping("/{id}")
    public ApiResponse<LetterDto.LetterResponse> getLetter(@PathVariable("id") UUID letterId) {
        return ApiResponse.ok(letterFlowService.getLetter(SecurityUtils.currentUser().userId(), letterId));
    }
}
