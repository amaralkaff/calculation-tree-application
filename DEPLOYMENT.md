# Deployment Guide

This guide covers deploying the Calculation Tree application to various platforms.

## Table of Contents
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)

## Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Steps

1. **Clone the repository:**
```bash
git clone <repository-url>
cd calculation-tree-app
```

2. **Set up environment variables:**

Backend `.env`:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Frontend `.env`:
```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

3. **Install dependencies:**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

4. **Start PostgreSQL:**
```bash
# Using Homebrew (macOS)
brew services start postgresql

# Using Docker
docker run -d \
  --name postgres \
  -e POSTGRES_USER=calcuser \
  -e POSTGRES_PASSWORD=calcpass \
  -e POSTGRES_DB=calctree \
  -p 5432:5432 \
  postgres:15-alpine
```

5. **Run the application:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and start all services:**
```bash
docker-compose up --build
```

2. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

3. **Stop services:**
```bash
docker-compose down
```

4. **Stop and remove volumes:**
```bash
docker-compose down -v
```

### Using Docker separately

**Backend:**
```bash
cd backend
docker build -t calc-tree-backend .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e JWT_SECRET=your-secret \
  calc-tree-backend
```

**Frontend:**
```bash
cd frontend
docker build -t calc-tree-frontend .
docker run -p 5173:5173 \
  -e VITE_API_URL=http://localhost:3000 \
  calc-tree-frontend
```

## Production Deployment

### Backend Deployment (Node.js)

#### Option 1: Vercel/Railway/Render

1. **Build the backend:**
```bash
cd backend
npm run build
```

2. **Set environment variables on platform:**
```
NODE_ENV=production
PORT=3000
DATABASE_URL=<your-production-db-url>
JWT_SECRET=<your-secure-secret>
JWT_EXPIRES_IN=7d
```

3. **Deploy:**
- Connect your Git repository
- Set build command: `npm run build`
- Set start command: `npm start`

#### Option 2: VPS (DigitalOcean, AWS EC2)

1. **Install Node.js and PostgreSQL:**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
```

2. **Set up the application:**
```bash
git clone <repository-url>
cd calculation-tree-app/backend
npm install
npm run build
```

3. **Use PM2 for process management:**
```bash
npm install -g pm2
pm2 start dist/index.js --name calc-tree-backend
pm2 startup
pm2 save
```

4. **Set up Nginx reverse proxy:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend Deployment

#### Option 1: Vercel (Recommended)

1. **Build configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

2. **Environment variables:**
```
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=https://api.yourdomain.com
```

3. **Deploy:**
```bash
npm install -g vercel
vercel --prod
```

#### Option 2: Netlify

1. **Build settings:**
- Build command: `npm run build`
- Publish directory: `dist`

2. **Environment variables:**
```
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=https://api.yourdomain.com
```

#### Option 3: GitHub Pages

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Update package.json:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Configure vite.config.ts:**
```typescript
export default defineConfig({
  base: '/calculation-tree-app/',
  // ... other config
});
```

4. **Deploy:**
```bash
npm run deploy
```

## Environment Variables

### Backend (.env)
```bash
# Server
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=your-very-secure-secret-key-change-this
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env)
```bash
# API URLs
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=https://api.yourdomain.com
```

## Database Setup

### PostgreSQL Cloud Options

#### 1. Supabase (Free tier available)
```bash
# Connection string format
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

#### 2. Railway (Free tier available)
- Create PostgreSQL database
- Copy connection URL
- Use as DATABASE_URL

#### 3. Neon (Free tier available)
- Create serverless PostgreSQL
- Copy connection string
- Use as DATABASE_URL

### Database Migration

If you need to reset the database:
```bash
# Drop all tables
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Restart backend to auto-create tables
npm start
```

## Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use HTTPS for all connections
- [ ] Set up proper CORS policies
- [ ] Enable database SSL connections
- [ ] Set up rate limiting
- [ ] Configure proper firewall rules
- [ ] Use environment variables for all secrets
- [ ] Enable database backups
- [ ] Set up monitoring and logging
- [ ] Review and update dependencies

## Monitoring

### Backend Health Check
```bash
curl https://api.yourdomain.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Logs

**Using PM2:**
```bash
pm2 logs calc-tree-backend
```

**Using Docker:**
```bash
docker logs calc-tree-backend
```

## Troubleshooting

### Common Issues

**Database Connection Failed:**
- Check DATABASE_URL format
- Verify database is running
- Check firewall rules
- Verify SSL settings

**CORS Errors:**
- Update FRONTEND_URL in backend .env
- Check CORS configuration in backend/src/index.ts

**WebSocket Connection Failed:**
- Ensure WebSocket proxy is configured in Nginx
- Check VITE_WS_URL matches backend URL
- Verify firewall allows WebSocket connections

**Build Failures:**
- Clear node_modules and reinstall
- Check Node.js version (18+)
- Verify TypeScript compilation

## Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Documentation: See README.md and API.md
