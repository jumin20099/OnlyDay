package com.onlyday.birthday.dto.file;

public class FileDto {

    public record UploadResponse(
            String fileUrl,
            String objectPath,
            String bucket,
            boolean publicBucket
    ) {
    }
}
