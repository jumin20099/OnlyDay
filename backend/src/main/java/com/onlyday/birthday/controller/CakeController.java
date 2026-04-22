package com.onlyday.birthday.controller;

import com.onlyday.birthday.api.ApiResponse;
import com.onlyday.birthday.dto.cake.CakeDto;
import com.onlyday.birthday.security.SecurityUtils;
import com.onlyday.birthday.service.CakeService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cakes")
public class CakeController {

    private final CakeService cakeService;

    public CakeController(CakeService cakeService) {
        this.cakeService = cakeService;
    }

    @PostMapping
    public ApiResponse<CakeDto.CakeSummary> create(@Valid @RequestBody CakeDto.CreateRequest request) {
        return ApiResponse.ok(cakeService.createCake(SecurityUtils.currentUser().userId(), request));
    }

    @GetMapping("/share/{shareToken}")
    public ApiResponse<CakeDto.CakeSummary> getByShareToken(@PathVariable String shareToken) {
        return ApiResponse.ok(cakeService.getByShareToken(shareToken));
    }

    @GetMapping("/me")
    public ApiResponse<List<CakeDto.CakeSummary>> myCakes() {
        return ApiResponse.ok(cakeService.getMyCakes(SecurityUtils.currentUser().userId()));
    }

    @PutMapping("/{cakeId}")
    public ApiResponse<CakeDto.CakeSummary> update(@PathVariable UUID cakeId,
                                                   @Valid @RequestBody CakeDto.UpdateRequest request) {
        return ApiResponse.ok(cakeService.updateCake(SecurityUtils.currentUser().userId(), cakeId, request));
    }

    @DeleteMapping("/{cakeId}")
    public ApiResponse<Void> delete(@PathVariable UUID cakeId) {
        cakeService.deleteCake(SecurityUtils.currentUser().userId(), cakeId);
        return ApiResponse.ok(null);
    }
}
