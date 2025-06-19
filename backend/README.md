# Real-Time Kanban Task Board Backend

This backend powers a real-time Kanban board using Express.js, Socket.IO, Redis, and PostgreSQL. It is designed for containerized deployment with Docker.

## Features

- Real-time task updates via WebSocket (Socket.IO)
- Persistent task storage in PostgreSQL
- Shared state and Pub/Sub with Redis
- Docker-ready for easy deployment

## Getting Started

### 1. Environment Variables

Create a `.env` file with the following:

```
PORT=4000
DATABASE_URL=postgresql://postgres:password@postgres:5432/taskboard
REDIS_URL=redis://redis:6379
```

### 2. Development

Install dependencies:

```
npm install
```

Run the server:

```
npm start
```

### 3. Docker

Build and run with Docker:

```
docker build -t kanban-backend .
docker run --env-file .env -p 4000:4000 kanban-backend
```

## Project Structure

- `src/index.js` — Main server entry point
- `Dockerfile` — Docker build instructions
- `.env` — Environment variables

---

## License

MIT
