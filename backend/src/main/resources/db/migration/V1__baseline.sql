-- Flyway 기준선(연결 확인). 개발은 기본적으로 spring.flyway.enabled=false + JPA ddl-auto=update.
-- 프로덕션에서 Flyway 전용 운영 시: 실제 DDL을 V2+로 추가하고 ddl-auto=validate 로 전환.
SELECT 1;
