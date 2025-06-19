# Real-Time Kanban Task Board (Monorepo)

A full-stack real-time Kanban board for collaborative task management.

## Tech Stack

- **Frontend:** React.js, Vite, TypeScript, TailwindCSS, dnd-kit, Socket.IO Client
- **Backend:** Node.js, Express.js, Sequelize (PostgreSQL), Redis (Pub/Sub), Socket.IO
- **Containerization:** Docker & Docker Compose

## Features

- Kanban Board UI (To Do, In Progress, Done)
- Drag & Drop tasks between columns
- Create/Edit tasks with color and description
- Real-time updates across all clients (WebSocket + Redis Pub/Sub)
- Skeleton loading for cards
- Persistent storage with PostgreSQL

## Project Structure

```
/ (root)
  ├── backend/   # Express.js, Socket.IO, Sequelize, Redis
  ├── frontend/  # React.js, Vite, TailwindCSS, dnd-kit
  └── docker-compose.yml
```

## Environment Variables

### Backend (`backend/.env`)

- `PORT` — Server port (default: 4000)
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string

### Frontend (`frontend/.env`)

- `VITE_API_URL` — Backend API URL (default: http://localhost:4000)

## Development

### Backend

```sh
cd backend
bun install
bun run dev
```

### Frontend

```sh
cd frontend
bun install
bun run dev
```

## Docker (Full Stack)

```sh
docker compose up --build
```

## API Endpoints (Backend)

- `GET /tasks` — Get all tasks
- `POST /tasks` — Create a new task
- `PUT /tasks/:id/move` — Move a task (change column/position)
- `PUT /tasks/:id` — Update task details (title, description, color, etc.)

---
