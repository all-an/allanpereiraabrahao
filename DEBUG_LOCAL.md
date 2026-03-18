# Local Development & Debugging

## Prerequisites

- Java 21
- Maven
- Node.js 20+
- Docker Desktop

---

## 1. Start the Database

```bash
docker-compose up -d
```

This starts PostgreSQL in a container named `allanpereiraabrahao_local_db` on port `5432`.

---

## 2. Start the Backend (Spring Boot)

### Option A — Maven CLI

```bash
./mvnw spring-boot:run
```

### Option B — IntelliJ IDEA (with debugger)

1. Open the project root in IntelliJ
2. Let Maven import finish
3. Open `BlogApplication.java`
4. Click the green **Debug** button (or `Shift+F9`)
5. Set breakpoints anywhere — IntelliJ will pause execution there

The backend runs on `http://localhost:8080`.
Tables are created automatically on first startup.
Admin user is seeded with username `admin` / password `admin123`.

---

## 3. Start the Frontend (Angular)

In a separate terminal:

```bash
cd frontend
npm install
npm run start
```

Angular dev server runs on `http://localhost:4200`.
All `/api` requests are proxied to `http://localhost:8080` via `proxy.conf.json` — no CORS issues.

> Use `http://localhost:4200` during development, not `:8080`.

---

## 4. Useful Debug Tips

### Check the database directly

```bash
docker exec -it allanpereiraabrahao_local_db psql -U common_user -d allanpereiraabrahao_local_db
```

Common queries:
```sql
\dt                          -- list all tables
SELECT * FROM posts;
SELECT * FROM users;
SELECT * FROM comments;
```

### See SQL queries in the console

In `application.properties`, set:
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### Test API endpoints directly

```bash
# Get all posts
curl http://localhost:8080/api/posts

# Login (returns session cookie)
curl -c cookies.txt -X POST http://localhost:8080/api/auth/login \
  -d "username=admin&password=admin123"

# Create a post (uses session cookie)
curl -b cookies.txt -X POST http://localhost:8080/api/admin/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello World","content":"My first post"}'

# Check current user
curl -b cookies.txt http://localhost:8080/api/auth/me
```

### Angular hot reload

The Angular dev server watches for file changes and reloads automatically — no restart needed for frontend changes.

### Backend hot reload (optional)

Add `spring-boot-devtools` to `pom.xml` for automatic backend restarts on code changes:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

---

## Summary

| What | URL | Command |
|------|-----|---------|
| Angular app (use this) | `http://localhost:4200` | `npm run start` in `frontend/` |
| Spring Boot API | `http://localhost:8080` | `./mvnw spring-boot:run` |
| Database | `localhost:5432` | `docker-compose up -d` |
