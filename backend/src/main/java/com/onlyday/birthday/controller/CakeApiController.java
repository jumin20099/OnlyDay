package com.onlyday.birthday.controller;

import com.onlyday.birthday.api.ApiResponse;
import com.onlyday.birthday.dto.cake.CakeDto;
import com.onlyday.birthday.security.SecurityUtils;
import com.onlyday.birthday.service.CakeService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cakes")
public class CakeApiController {

    private final CakeService cakeService;

    public CakeApiController(CakeService cakeService) {
        this.cakeService = cakeService;
    }

    @GetMapping
    public ApiResponse<List<CakeDto.CakeSummary>> getCakes() {
        return ApiResponse.ok(cakeService.getMyCakes(SecurityUtils.currentUser().userId()));
    }

    @GetMapping("/share/{shareToken}")
    public ApiResponse<CakeDto.CakeSummary> getByShareToken(@PathVariable String shareToken) {
        return ApiResponse.ok(cakeService.getByShareToken(shareToken));
    }

    @PostMapping
    public ApiResponse<CakeDto.CakeSummary> createCake(@Valid @RequestBody CakeDto.CreateRequest request) {
        return ApiResponse.ok(cakeService.createCake(SecurityUtils.currentUser().userId(), request));
    }
}
