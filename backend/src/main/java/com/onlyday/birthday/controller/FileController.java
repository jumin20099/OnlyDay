package com.onlyday.birthday.controller;

import com.onlyday.birthday.api.ApiResponse;
import com.onlyday.birthday.dto.file.FileDto;
import com.onlyday.birthday.service.FileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/presign")
    public ApiResponse<FileDto.PresignResponse> presign(@Valid @RequestBody FileDto.PresignRequest request) {
        return ApiResponse.ok(fileService.presign(request));
    }
}
