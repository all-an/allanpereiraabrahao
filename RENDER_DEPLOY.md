# Deploy to Render

## Prerequisites
- A [Render](https://render.com) account
- The repository pushed to GitHub

---

## Automatic Deploy via `render.yaml`

This project includes a `render.yaml` Blueprint. Render will automatically:
1. Create a **Web Service** (Docker-based)
2. Create a **PostgreSQL database**
3. Wire the database URL/credentials into the app as environment variables

### Steps

1. Push this repository to GitHub (or GitLab).

2. In Render dashboard → **New** → **Blueprint**.

3. Connect your repository. Render detects `render.yaml` automatically.

4. Set the `ADMIN_PASSWORD` environment variable to a secure value (Render generates one by default since `generateValue: true` is set — you can override it).

5. Click **Apply**. Render will:
   - Provision a free PostgreSQL database
   - Build the Docker image
   - Start the web service

6. Once deployed, the app is available at your Render URL (e.g. `https://allanpereiraabrahao.onrender.com`).

---

## Manual Deploy (without Blueprint)

### 1. Create a PostgreSQL database

- Render dashboard → **New** → **PostgreSQL**
- Name: `allanpereiraabrahao-db`
- Plan: Free
- Note the **Internal Database URL** after creation

### 2. Create a Web Service

- Render dashboard → **New** → **Web Service**
- Connect your GitHub repository
- **Environment**: Docker
- **Plan**: Free

### 3. Set Environment Variables

| Key | Value |
|-----|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | Internal DB URL from step 1 |
| `DB_USER` | DB username from step 1 |
| `DB_PASSWORD` | DB password from step 1 |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | a secure password |

### 4. Deploy

Click **Create Web Service**. Render builds the Docker image and starts the app.

---

## Notes

- **Free tier** spins down after 15 minutes of inactivity — first request after idle will be slow.
- The database tables are created automatically on first startup (`ddl-auto=update`).
- The admin user is created on first startup using the `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars.
- Render free PostgreSQL databases expire after 90 days — upgrade to a paid plan for production.
