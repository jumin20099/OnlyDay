package com.onlyday.birthday.service;

import com.onlyday.birthday.dto.file.FileDto;
import com.onlyday.birthday.exception.BusinessException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Supabase Storage에 서버(서비스 롤)로 직접 업로드합니다.
 * <a href="https://supabase.com/docs/reference/api/create-an-object">Storage API</a>
 */
@Service
public class FileService {

    private static final int MAX_FILENAME_LEN = 120;

    private final RestClient http;
    private final String supabaseBaseUrl;
    private final String bucket;
    private final boolean publicBucket;

    public FileService(
            @Value("${app.supabase.url}") String supabaseUrl,
            @Value("${app.supabase.service-role-key}") String serviceRoleKey,
            @Value("${app.supabase.storage.bucket}") String bucket,
            @Value("${app.supabase.storage.public-bucket:true}") boolean publicBucket
    ) {
        this.supabaseBaseUrl = supabaseUrl.endsWith("/")
                ? supabaseUrl.substring(0, supabaseUrl.length() - 1)
                : supabaseUrl;
        this.bucket = bucket;
        this.publicBucket = publicBucket;
        this.http = RestClient.builder()
                .defaultHeader("Authorization", "Bearer " + serviceRoleKey)
                .defaultHeader("apikey", serviceRoleKey)
                .build();
    }

    public FileDto.UploadResponse upload(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw new BusinessException("EMPTY_FILE", "File is empty", HttpStatus.BAD_REQUEST);
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException("INVALID_CONTENT_TYPE", "Only image uploads are allowed", HttpStatus.BAD_REQUEST);
        }

        String objectKey = buildObjectKey(folder, file.getOriginalFilename());
        java.net.URI uploadUri = buildObjectUploadUri(objectKey);

        try {
            byte[] bytes = file.getBytes();
            var resource = new ByteArrayResource(bytes) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "image";
                }
            };
            http.post()
                    .uri(uploadUri)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException e) {
            throw new BusinessException("STORAGE_ERROR", e.getResponseBodyAsString(), HttpStatus.BAD_GATEWAY);
        } catch (Exception e) {
            throw new BusinessException("STORAGE_ERROR", e.getMessage() != null ? e.getMessage() : "upload failed", HttpStatus.BAD_GATEWAY);
        }

        String fileUrl = publicBucket ? buildPublicFileUrl(objectKey) : null;
        return new FileDto.UploadResponse(fileUrl, objectKey, bucket, publicBucket);
    }

    private java.net.URI buildObjectUploadUri(String objectKey) {
        var builder = UriComponentsBuilder
                .fromHttpUrl(supabaseBaseUrl + "/storage/v1/object")
                .pathSegment(bucket);
        for (String seg : splitPath(objectKey)) {
            builder.pathSegment(seg);
        }
        return builder.queryParam("upsert", "true").build().encode().toUri();
    }

    private String buildObjectKey(String folder, String originalFilename) {
        String name = StringUtils.getFilename(originalFilename);
        if (name == null || name.isBlank()) {
            name = "image";
        }
        name = sanitizeFileName(name);
        String base = StringUtils.hasText(folder) ? sanitizeFolder(folder) : "uploads";
        return base + "/" + UUID.randomUUID() + "-" + name;
    }

    private String sanitizeFolder(String folder) {
        String f = folder.replace("..", "").replaceAll("[^a-zA-Z0-9/_-]", "");
        if (f.isEmpty()) {
            return "uploads";
        }
        if (f.startsWith("/")) {
            f = f.substring(1);
        }
        return f;
    }

    private String sanitizeFileName(String name) {
        String n = name.replaceAll("[^a-zA-Z0-9._-]", "_");
        if (n.isEmpty()) {
            n = "file";
        }
        if (n.length() > MAX_FILENAME_LEN) {
            n = n.substring(0, MAX_FILENAME_LEN);
        }
        return n;
    }

    private List<String> splitPath(String path) {
        List<String> segs = new ArrayList<>();
        for (String p : path.split("/")) {
            if (!p.isEmpty()) {
                segs.add(p);
            }
        }
        return segs;
    }

    /**
     * Public 버킷일 때만 브라우저에서 직접 열 수 있는 URL.
     */
    private String buildPublicFileUrl(String objectKey) {
        var builder = UriComponentsBuilder
                .fromHttpUrl(supabaseBaseUrl + "/storage/v1/object/public")
                .pathSegment(bucket);
        for (String seg : splitPath(objectKey)) {
            builder.pathSegment(seg);
        }
        return builder.build().encode().toUriString();
    }
}
