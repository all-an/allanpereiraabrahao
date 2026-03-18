# Docker Image — Build & Run

## Prerequisites
- Docker Desktop installed and running

---

## Local Development (database only)

Start just the PostgreSQL database:

```bash
docker-compose up -d
```

This creates a container named `allanpereiraabrahao_local_db` with:
- Database: `allanpereiraabrahao_local_db`
- User: `common_user`
- Password: `common_user`
- Port: `5432`

Then run the backend separately:

```bash
# Build frontend first
cd frontend
npm install
npm run build
cd ..

# Run Spring Boot
./mvnw spring-boot:run
```

App is available at `http://localhost:8080`.

---

## Build the Production Docker Image

From the project root:

```bash
docker build -t allanpereiraabrahao-blog .
```

This runs a 3-stage build:
1. Builds the Angular frontend
2. Builds the Spring Boot JAR (with Angular dist embedded)
3. Creates a slim runtime image

---

## Run the Production Image Locally

You need a running PostgreSQL instance. Use docker-compose for that, or pass a custom DB URL.

### Option A — Use docker-compose DB + run image

```bash
# Start the DB
docker-compose up -d

# Run the app image, pointing to the local DB
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/allanpereiraabrahao_local_db \
  -e DB_USER=common_user \
  -e DB_PASSWORD=common_user \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=admin123 \
  allanpereiraabrahao-blog
```

### Option B — docker-compose with full stack

Add an `app` service to `docker-compose.yml` if you want everything in one command:

```yaml
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_URL: jdbc:postgresql://db:5432/allanpereiraabrahao_local_db
      DB_USER: common_user
      DB_PASSWORD: common_user
      ADMIN_USERNAME: admin
      ADMIN_PASSWORD: admin123
    depends_on:
      - db
```

Then:

```bash
docker-compose up --build
```

---

## Default Admin Credentials

On first startup, an admin user is auto-created:
- Username: value of `ADMIN_USERNAME` env var (default: `admin`)
- Password: value of `ADMIN_PASSWORD` env var (default: `admin123`)

**Change these in production.**

---

## Push Image to Docker Hub

### 1. Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

### 2. Build the image with your Docker Hub tag

Replace `your-dockerhub-username` with your actual username:

```bash
docker build -t your-dockerhub-username/allanpereiraabrahao-blog:latest .
docker build -t allan8tech/allanpereiraabrahao-blog:latest .
```

### 3. Push the image

```bash
docker push allan8tech/allanpereiraabrahao-blog:latest
```

The image is now publicly available at:
`docker.io/your-dockerhub-username/allanpereiraabrahao-blog:latest`

---

## Deploy on Render using the Docker Hub image

### 1. Create a new Web Service on Render

- Go to [render.com](https://render.com) → **New** → **Web Service**
- Choose **Deploy an existing image from a registry**
- Enter the image URL:
  ```
  docker.io/your-dockerhub-username/allanpereiraabrahao-blog:latest
  ```

### 2. Configure the service

| Field | Value |
|---|---|
| Name | `allanpereiraabrahao-blog` |
| Region | Your preferred region |
| Instance Type | Free (or higher) |
| Port | `8080` |

### 3. Set environment variables

Under **Environment**, add:

| Key | Value |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | `jdbc:postgresql://<your-render-db-host>:5432/<db-name>` |
| `DB_USER` | your DB user |
| `DB_PASSWORD` | your DB password |
| `ADMIN_USERNAME` | your admin username |
| `ADMIN_PASSWORD` | a strong password |

> **Tip:** Create a PostgreSQL database on Render first (**New → PostgreSQL**), then copy the **Internal Database URL** and split it into the env vars above.

### 4. Deploy

Click **Create Web Service**. Render will pull the image from Docker Hub and start the container.

### Updating the deployment

After making changes, rebuild and push a new image:

```bash
docker build -t your-dockerhub-username/allanpereiraabrahao-blog:latest .
docker push your-dockerhub-username/allanpereiraabrahao-blog:latest
```

Then on Render, click **Manual Deploy → Deploy latest image**.
