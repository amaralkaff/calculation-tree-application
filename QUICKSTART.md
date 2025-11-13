# Quick Start Guide

Get the Calculation Tree application running in 5 minutes!

## Prerequisites

- Docker & Docker Compose installed
- OR Node.js 18+ and PostgreSQL 15+

## Option 1: Docker Compose (Recommended)

1. **Navigate to project:**
```bash
cd calculation-tree-app
```

2. **Start everything:**
```bash
docker-compose up
```

3. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

4. **Create an account and start using!**

## Option 2: Local Development

1. **Start PostgreSQL:**
```bash
# Using Docker
docker run -d \
  --name postgres \
  -e POSTGRES_USER=calcuser \
  -e POSTGRES_PASSWORD=calcpass \
  -e POSTGRES_DB=calctree \
  -p 5432:5432 \
  postgres:15-alpine
```

2. **Set up backend:**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

3. **Set up frontend (in new terminal):**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

4. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## First Steps

### 1. Register an Account
- Click "Register"
- Choose a username (min 3 characters)
- Choose a password (min 6 characters)

### 2. Start a Calculation Chain
- Click "Start New Chain"
- Enter a starting number (e.g., 10)
- Click "Start"

### 3. Add Operations
- Click "Respond" on any calculation
- Choose an operation (add, subtract, multiply, divide)
- Enter a number
- Click "Add"

### 4. View the Tree
- See calculations grow in real-time
- Each calculation shows the operation and result
- Children are indented under their parent

## Example Usage

```
User1 starts: 10
  └─ User2 adds 5 = 15
      └─ User1 multiplies 2 = 30
          └─ User3 divides 3 = 10
  └─ User3 subtracts 3 = 7
      └─ User2 adds 1 = 8
```

## Common Commands

### Development
```bash
# Backend
npm run dev          # Start dev server
npm test            # Run tests
npm run build       # Build for production

# Frontend
npm run dev         # Start dev server
npm test           # Run tests
npm run build      # Build for production
```

### Docker
```bash
docker-compose up            # Start all services
docker-compose up --build    # Rebuild and start
docker-compose down          # Stop all services
docker-compose down -v       # Stop and remove volumes
docker-compose logs -f       # View logs
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5173

# Kill the process or use different ports
```

### Database Connection Error
```bash
# Make sure PostgreSQL is running
docker ps | grep postgres

# Or restart it
docker restart postgres
```

### WebSocket Not Connecting
- Check if backend is running on port 3000
- Verify VITE_WS_URL in frontend/.env
- Check browser console for errors

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [API.md](./backend/API.md) for API documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment options
- Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for technical details

## Support

Found an issue? Check the documentation or create an issue in the repository.

Enjoy building calculation trees! 🌳✨
