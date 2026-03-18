# allanpereiraabrahao — Blog

A simple blog with posts, likes, and comments.

---

## Architecture

This project is a **Java Spring Boot backend** that serves an **Angular SPA (Single Page Application)** as its frontend.

They are two separate projects that work together:

```
┌─────────────────────────────────────────┐
│              Browser                    │
│                                         │
│   Angular SPA (handles all UI/routing)  │
│         makes HTTP calls to /api        │
└────────────────┬────────────────────────┘
                 │ HTTP (JSON)
┌────────────────▼────────────────────────┐
│         Spring Boot (Java)              │
│                                         │
│  • Serves Angular's index.html + assets │
│  • REST API at /api/**                  │
│  • Session-based authentication         │
│  • JPA + PostgreSQL                     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           PostgreSQL                    │
│   (Docker locally / Render in prod)     │
└─────────────────────────────────────────┘
```

### How they connect

- The Angular app is **compiled into static files** (`index.html`, `main.js`, `styles.css`, etc.)
- Those files are placed inside `src/main/resources/static/` and **served directly by Spring Boot**
- Angular handles all client-side routing — Spring Boot's `SpaController` forwards any unknown route back to `index.html` so Angular Router takes over
- All data flows through the REST API at `/api/**`

This means **there is no template engine** (no Thymeleaf, no JSP). Spring Boot is purely an API + static file server.

---

## Features

| Feature | Auth required |
|---------|--------------|
| Read posts | No |
| Like a post | No |
| Comment on a post | Yes (login) |
| Create / edit / delete posts | Yes (admin only) |

---

## Project Structure

```
.
├── frontend/               # Angular 17 SPA
│   ├── src/
│   │   └── app/
│   │       ├── pages/      # home, post detail, login, admin
│   │       └── services/   # auth, post API calls
│   ├── angular.json
│   └── package.json
│
├── src/main/java/          # Spring Boot backend
│   └── com/allanpereiraabrahao/blog/
│       ├── config/         # Security, admin user seed
│       ├── controller/     # REST controllers + SPA fallback
│       ├── model/          # Post, Comment, User entities
│       ├── repository/     # JPA repositories
│       └── service/        # Business logic
│
├── src/main/resources/
│   ├── application.properties       # local config
│   ├── application-prod.properties  # production config (uses env vars)
│   └── static/                      # Angular build output goes here
│
├── docker-compose.yml      # local PostgreSQL
├── Dockerfile              # 3-stage build (Node → Maven → JRE)
└── render.yaml             # Render deployment blueprint
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/posts` | — | List all posts |
| `GET` | `/api/posts/:slug` | — | Get post + comments |
| `POST` | `/api/posts/:slug/like` | — | Like a post |
| `POST` | `/api/posts/:slug/comments` | User | Add a comment |
| `GET` | `/api/auth/me` | — | Current session user |
| `POST` | `/api/auth/login` | — | Login |
| `POST` | `/api/auth/logout` | — | Logout |
| `GET` | `/api/admin/posts` | Admin | List posts |
| `POST` | `/api/admin/posts` | Admin | Create post |
| `PUT` | `/api/admin/posts/:id` | Admin | Update post |
| `DELETE` | `/api/admin/posts/:id` | Admin | Delete post |

---

## Running Locally

See [DEBUG_LOCAL.md](./DEBUG_LOCAL.md) for full local development and debugging instructions.

**Quick start:**

```bash
# 1. Start the database
docker-compose up -d

# 2. Start the backend
./mvnw spring-boot:run

# 3. Start the frontend (separate terminal)
cd frontend && npm install && npm run start
```

Open `http://localhost:4200`.

Default admin credentials: `admin` / `admin123`.

---

## Deployment

- **Docker image**: see [DOCKER_IMAGE_UP.md](./DOCKER_IMAGE_UP.md)
- **Render**: see [RENDER_DEPLOY.md](./RENDER_DEPLOY.md)
- **Docker multi-stage build explained**: see [DOCKER_MULTISTAGE_BUILD.md](./DOCKER_MULTISTAGE_BUILD.md)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17 (standalone components) |
| Backend | Java 21 + Spring Boot 3.2 |
| Auth | Spring Security (session-based, form login) |
| Database | PostgreSQL 16 |
| ORM | Spring Data JPA / Hibernate |
| Local DB | Docker Compose |
| Deployment | Docker + Render |
