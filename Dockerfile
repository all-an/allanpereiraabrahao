# Stage 1: Build Angular frontend
FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Override output to a fixed path inside the container
RUN npx ng build --output-path=/dist --base-href /

# Stage 2: Build Spring Boot backend
FROM maven:3.9-eclipse-temurin-25 AS backend
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
# Inject Angular dist into Spring Boot static resources
COPY --from=frontend /dist/browser ./src/main/resources/static
RUN mvn package -DskipTests -q

# Stage 3: Runtime
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=backend /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
