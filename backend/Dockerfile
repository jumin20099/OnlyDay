# backend/ 에서: docker build -t onlyday-api .
#   docker run -p 8080:8080 --env-file .env onlyday-api
FROM gradle:8.10.2-jdk17-alpine AS build
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon -x test

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN adduser -D -H -s /sbin/nologin appuser
COPY --from=build /app/build/libs/*.jar /app/app.jar
USER appuser
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java -XX:+UseContainerSupport -Djava.security.egd=file:/dev/./urandom -jar /app/app.jar"]
