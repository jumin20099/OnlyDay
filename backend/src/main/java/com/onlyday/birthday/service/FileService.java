package com.onlyday.birthday.service;

import com.onlyday.birthday.dto.file.FileDto;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Service
public class FileService {

    private final S3Presigner s3Presigner;
    private final String bucket;
    private final String region;

    public FileService(S3Presigner s3Presigner,
                       @Value("${app.aws.s3-bucket}") String bucket,
                       @Value("${app.aws.region}") String region) {
        this.s3Presigner = s3Presigner;
        this.bucket = bucket;
        this.region = region;
    }

    public FileDto.PresignResponse presign(FileDto.PresignRequest request) {
        String safeFilename = URLEncoder.encode(request.filename(), StandardCharsets.UTF_8);
        String folder = request.folder() == null || request.folder().isBlank() ? "uploads" : request.folder();
        String key = folder + "/" + UUID.randomUUID() + "-" + safeFilename;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(request.contentType())
                .build();

        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(PutObjectPresignRequest.builder()
                .putObjectRequest(putObjectRequest)
                .signatureDuration(Duration.ofMinutes(10))
                .build());

        String fileUrl = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
        return new FileDto.PresignResponse(presignedRequest.url().toString(), fileUrl, key);
    }
}
