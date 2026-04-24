package com.onlyday.birthday.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityScheme.Type;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI onlydayOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("OnlyDay Birthday API")
                        .version("0.0.1")
                        .description("Bearer JWT는 /auth/login·/auth/signup 응답 accessToken. "
                                + "편지·촛불 작성(POST /letters, POST /api/cakes/{token}/candles)은 비로그인 가능; "
                                + "Bearer로 로그인한 경우에만 케이크 주인·본인 케이크 쓰기가 차단됨."))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .name("bearerAuth")
                                        .type(Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
