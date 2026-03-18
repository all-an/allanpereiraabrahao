# Updating the Docker Image

After making changes to the frontend or backend, rebuild and redeploy:

## 1. Rebuild the image

```bash
docker build -t allanpereiraabrahao-blog .
```

## 2. Test locally before deploying

```bash
docker-compose up -d

docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/allanpereiraabrahao_local_db \
  -e DB_USER=common_user \
  -e DB_PASSWORD=common_user \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=admin123 \
  allanpereiraabrahao-blog
```

Open `http://localhost:8080` to verify the changes.

## 3. Commit and push to trigger Render deploy

```bash
git add .
git commit -m "your message"
git push
```

Render automatically redeploys on every push to `main`.
