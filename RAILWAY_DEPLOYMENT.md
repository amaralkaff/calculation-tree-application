# Railway Deployment Guide

This guide will help you deploy the Calculation Tree application to Railway with PostgreSQL, Backend, and Frontend services.

## Prerequisites

1. Railway account: https://railway.app
2. GitHub repository connected to Railway
3. Railway CLI (optional): `npm i -g @railway/cli`

## Architecture

The application consists of three Railway services:

1. **PostgreSQL Database** - Managed PostgreSQL database
2. **Backend API** - Node.js/Express REST API with WebSocket
3. **Frontend** - React SPA served via Nginx

## Deployment Steps

### 1. Create a New Railway Project

```bash
# Via Railway CLI
railway login
railway init

# Or use Railway Dashboard at https://railway.app/new
```

### 2. Deploy PostgreSQL Database

1. In Railway Dashboard, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will automatically provision a PostgreSQL database
3. Note the connection string (it's automatically available as DATABASE_URL)

### 3. Deploy Backend Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your repository: `amaralkaff/calculation-tree-application`
3. Configure the service:

**Root Directory**: `/backend`

**Build Configuration**:
- Builder: Dockerfile
- Dockerfile Path: `Dockerfile.prod`

**Environment Variables**:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<generate-a-secure-random-string>
FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
```

**Start Command**: `node dist/index.js`

**Health Check Path**: `/health`

### 4. Deploy Frontend Service

1. Click **"+ New"** → **"GitHub Repo"**
2. Select the same repository
3. Configure the service:

**Root Directory**: `/frontend`

**Build Configuration**:
- Builder: Dockerfile
- Dockerfile Path: `Dockerfile.prod`

**Environment Variables**:
```
VITE_API_URL=https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}
```

**Health Check Path**: `/health`

## Environment Variable Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | `production` |
| PORT | Server port | `3000` |
| DATABASE_URL | PostgreSQL connection | Auto-provided by Railway |
| JWT_SECRET | Secret for JWT tokens | `your-super-secret-key-min-32-chars` |
| FRONTEND_URL | Frontend domain for CORS | `https://your-frontend.railway.app` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | `https://your-backend.railway.app` |

## Generating JWT Secret

```bash
# Generate a secure random string (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Service Configuration

### Backend Service

- **Instance**: Hobby Plan (or higher)
- **Region**: Choose closest to your users
- **Deployment**: Automatic on git push to main

### Frontend Service

- **Instance**: Hobby Plan (or higher)
- **Region**: Same as backend for lower latency
- **Deployment**: Automatic on git push to main

### Database Service

- **Instance**: Hobby Dev (or higher for production)
- **Backup**: Automatic daily backups
- **Connection Pooling**: Enabled

## Post-Deployment Configuration

### 1. Update CORS Settings

The backend automatically uses the FRONTEND_URL environment variable for CORS.
Ensure this is set correctly after frontend deployment.

### 2. Database Migrations

Database migrations run automatically on deployment (Sequelize sync).
For production, consider using migrations instead of sync.

### 3. Verify Services

```bash
# Health checks
curl https://your-backend.railway.app/health
curl https://your-frontend.railway.app/health

# Test WebSocket
# Open browser console on frontend
# Check Network tab for WebSocket connection
```

## Connecting Services

Railway automatically creates service references using the `${{ServiceName.VAR}}` syntax.

Example:
```
# Backend references database
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Frontend references backend
VITE_API_URL=https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}

# Backend references frontend for CORS
FRONTEND_URL=https://${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
```

## Custom Domains (Optional)

1. Go to service settings
2. Click **"Settings"** → **"Domains"**
3. Click **"Generate Domain"** for Railway subdomain
4. Or click **"Custom Domain"** to add your own domain

Example setup:
- Backend: `api.yourdomain.com`
- Frontend: `yourdomain.com` or `app.yourdomain.com`

## Monitoring

### Logs

View logs in Railway Dashboard:
1. Select service
2. Click **"Deployments"**
3. Click on active deployment
4. View real-time logs

### Metrics

Railway provides:
- CPU usage
- Memory usage
- Network bandwidth
- Request latency
- Instance status

## Troubleshooting

### Backend Won't Connect to Database

**Issue**: `ECONNREFUSED` or `connection timeout`

**Solution**:
1. Verify DATABASE_URL is set correctly
2. Check database service is running
3. Ensure backend references: `${{Postgres.DATABASE_URL}}`

### Frontend Can't Reach Backend

**Issue**: CORS errors or 404 on API calls

**Solution**:
1. Verify VITE_API_URL is set correctly
2. Check FRONTEND_URL in backend matches frontend domain
3. Ensure backend service is publicly accessible
4. Rebuild frontend after changing VITE_API_URL

### WebSocket Connection Failed

**Issue**: WebSocket disconnects or won't connect

**Solution**:
1. Verify backend WebSocket endpoint is accessible
2. Check frontend Socket.io configuration
3. Ensure both services use HTTPS (wss:// for WebSocket)
4. Check Railway network policies allow WebSocket

### Build Failures

**Issue**: Rollup or native module errors

**Solution**:
1. Ensure Dockerfile.prod includes build dependencies
2. Verify npm ci runs successfully
3. Check Node.js version compatibility (20+)
4. Review build logs for specific errors

## Scaling

### Horizontal Scaling

Railway supports horizontal scaling:
1. Go to service settings
2. Increase replica count
3. Note: PostgreSQL connection pooling recommended

### Vertical Scaling

Upgrade instance size:
1. Go to service settings
2. Select larger instance type
3. Hobby → Pro → Enterprise

## Cost Optimization

1. **Use Hobby Plan** for development ($5/month)
2. **Enable Sleep** for non-production services
3. **Monitor Usage** in billing dashboard
4. **Set Spending Limits** to avoid surprises

## Security Best Practices

1. **JWT Secret**: Use strong random strings (32+ characters)
2. **Environment Variables**: Never commit secrets to git
3. **HTTPS**: Always enabled on Railway by default
4. **Database**: Use connection pooling and prepared statements
5. **CORS**: Restrict to specific frontend domain

## Maintenance

### Database Backups

Railway automatically backs up PostgreSQL daily.
Manual backups:
1. Go to database service
2. Click **"Data"**
3. Click **"Create Snapshot"**

### Updating Dependencies

```bash
# Update and rebuild
git pull
npm update
git add package*.json
git commit -m "chore: update dependencies"
git push

# Railway auto-deploys on push
```

### Rolling Back

1. Go to service **"Deployments"**
2. Find previous successful deployment
3. Click **"Redeploy"**

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: https://github.com/amaralkaff/calculation-tree-application/issues

## Production Checklist

- [ ] PostgreSQL database provisioned
- [ ] Backend service deployed and healthy
- [ ] Frontend service deployed and healthy
- [ ] Environment variables configured
- [ ] JWT secret generated and set
- [ ] CORS configured correctly
- [ ] WebSocket connection working
- [ ] Custom domains configured (if applicable)
- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Backup strategy confirmed
- [ ] SSL/TLS certificates active

## Deployment Commands Summary

```bash
# Clone repository
git clone https://github.com/amaralkaff/calculation-tree-application.git
cd calculation-tree-application

# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# Deploy backend
cd backend
railway up -d Dockerfile.prod

# Deploy frontend
cd ../frontend
railway up -d Dockerfile.prod

# Check status
railway status

# View logs
railway logs
```

## Next Steps

After successful deployment:

1. Test all 6 PRD business scenarios
2. Verify WebSocket real-time updates
3. Check authentication flow
4. Test calculation tree operations
5. Monitor performance metrics
6. Set up custom domains (optional)
7. Configure alerts and monitoring

Your application is now live on Railway! 🚀
