# Calculation Tree Application

A full-stack application for number-based discussions where users communicate through mathematical operations.

## Quick Start

```bash
docker-compose up
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Tech Stack

**Backend:** Node.js, TypeScript, Express, PostgreSQL, Socket.io, JWT
**Frontend:** React, TypeScript, Vite, shadcn/ui, Tailwind CSS
**DevOps:** Docker Compose

## Features

**Guest Users:**
- View all calculation trees
- Create account and login

**Registered Users:**
- Start calculation chains with initial numbers
- Add operations (add, subtract, multiply, divide) to any number
- View real-time updates as others contribute

## Development

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
