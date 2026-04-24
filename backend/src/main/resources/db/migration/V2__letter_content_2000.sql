-- 편지 본문 최대 2000자 (애플리케이션 @Column(length=2000)와 맞춤)
ALTER TABLE letters ALTER COLUMN content TYPE VARCHAR(2000);
