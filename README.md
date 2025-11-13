# Calculation Tree Application

A full-stack application for number-based discussions where users communicate through mathematical operations.

## Overview

This application allows users to:
- Start calculation chains with initial numbers
- Respond to numbers with mathematical operations (add, subtract, multiply, divide)
- View calculation trees in a social network-like structure

## Tech Stack

### Backend
- Node.js
- TypeScript
- Express
- PostgreSQL
- WebSocket (Socket.io)
- JWT Authentication

### Frontend
- React
- TypeScript
- Vite
- Material-UI / Tailwind CSS

### DevOps
- Docker Compose
- Docker

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd calculation-tree-app
```

2. Start the development environment:
```bash
docker-compose up
```

3. The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Development

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features

### For Unregistered Users
- View all calculation trees
- Create an account
- Log in

### For Registered Users
- Start calculation chains with initial numbers
- Add operations to existing numbers
- Respond to any calculation in the tree

## API Documentation

See [API.md](./backend/API.md) for detailed API documentation.

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
calculation-tree-app/
├── backend/          # Node.js + TypeScript backend
├── frontend/         # React + TypeScript frontend
├── docker-compose.yml
└── README.md
```

## License

MIT
