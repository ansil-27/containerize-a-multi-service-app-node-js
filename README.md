# Ansil's Blog

A basic full-stack blog app with a React frontend, Node.js/Express backend, and PostgreSQL database.

## Run With Docker

Database credentials and ports are stored in `.env`. Edit that file before starting Docker if you want different values.

```bash
docker compose up --build
```

Open the app at:

```text
http://localhost:5173
```

The API runs at:

```text
http://localhost:5000
```

PostgreSQL is exposed on:

```text
localhost:5432
```

## Features

- View blog posts
- Create new posts
- Edit existing posts
- Delete posts
- PostgreSQL-backed storage
- Docker Compose environment for frontend, backend, and database

## Project Structure

```text
.env
.env.example
backend/
  db/init.sql
  src/db.js
  src/server.js
frontend/
  src/App.jsx
  src/main.jsx
  src/styles.css
docker-compose.yml
```

## Useful Commands

Reset the database volume and recreate the seed data:

```bash
docker compose down -v
docker compose up --build
```

Run only the backend locally:

```bash
cd backend
npm install
npm run dev
```

Run only the frontend locally:

```bash
cd frontend
npm install
npm run dev
```

When running locally without Docker, set `DATABASE_URL` for the backend and `VITE_API_URL` for the frontend as needed.
