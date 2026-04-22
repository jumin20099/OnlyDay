package com.onlyday.birthday.controller;

import com.onlyday.birthday.api.ApiResponse;
import com.onlyday.birthday.dto.letter.LetterDto;
import com.onlyday.birthday.security.SecurityUtils;
import com.onlyday.birthday.service.SavedLetterService;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/saved-letters")
public class SavedLetterController {

    private final SavedLetterService savedLetterService;

    public SavedLetterController(SavedLetterService savedLetterService) {
        this.savedLetterService = savedLetterService;
    }

    @PostMapping("/{letterId}")
    public ApiResponse<Void> save(@PathVariable UUID letterId) {
        savedLetterService.saveLetter(SecurityUtils.currentUser().userId(), letterId);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{letterId}")
    public ApiResponse<Void> remove(@PathVariable UUID letterId) {
        savedLetterService.removeSavedLetter(SecurityUtils.currentUser().userId(), letterId);
        return ApiResponse.ok(null);
    }

    @GetMapping
    public ApiResponse<List<LetterDto.SavedLetterResponse>> list() {
        return ApiResponse.ok(savedLetterService.getSavedLetters(SecurityUtils.currentUser().userId()));
    }
}
