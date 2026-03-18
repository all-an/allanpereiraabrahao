# How the 3-Stage Docker Build Works

Everything happens automatically with a single command:

```bash
docker build -t allanpereiraabrahao-blog .
```

The `Dockerfile` has 3 `FROM` stages:

---

## Stage 1 — Frontend (Node.js)

```dockerfile
FROM node:20-alpine AS frontend
```

- Uses a `node:20` image
- Runs `npm ci` to install Angular dependencies
- Runs `ng build` to compile the Angular app
- Outputs the built files to `/dist` inside the container

---

## Stage 2 — Backend (Maven)

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS backend
```

- Uses a `maven` image
- Copies the Angular `/dist` output from Stage 1 into `src/main/resources/static/`
- Runs `mvn package` to compile and package the Spring Boot app
- The resulting JAR now contains the Angular app as embedded static files — no separate web server needed

---

## Stage 3 — Runtime (JRE only)

```dockerfile
FROM eclipse-temurin:21-jre
```

- Uses a minimal `eclipse-temurin:21-jre` image
- Copies **only the JAR** from Stage 2
- Runs it with `java -jar app.jar`

The final image contains only the JRE + the JAR (~200MB).
No Node.js, no Maven, no source code — just what's needed to run.

---

## Why Multi-Stage?

Without multi-stage builds, the final image would include Node.js, Maven, all source code, and all build tools — resulting in an image of 1GB+. Multi-stage builds discard everything except the final artifact, keeping the production image small and secure.
