# Calculation Tree Application

> **Test Assignment Submission** for Full Stack Developer Position at Ellty (Taskina Pty Ltd)
> **Submitted by:** [Your Name]
> **Date:** [Current Date]
> **Assignment Version:** 1.0 (03.02.2024)

## 🚀 Live Demo

**Frontend:** https://calculation-tree-frontend-production.up.railway.app
**Backend API:** https://calculation-tree-backend-production.up.railway.app
**GitHub Repository:** https://github.com/amaralkaff/calculation-tree-application

## 📋 Project Overview

A full-stack web application where users communicate through numbers and mathematical operations. Users can start "discussions" by posting an initial number, and others can respond by applying mathematical operations (addition, subtraction, multiplication, division) to create branching calculation trees - similar to how social media posts and comments work, but with numbers!

## ✨ Features & Business Scenarios

This application fulfills all required business scenarios:

### ✅ Scenario 1: View Calculation Trees (Unregistered Users)
- Unregistered users can view the entire tree of calculations on the homepage
- Real-time updates using WebSocket connections
- Visual tree structure showing all operations and results

### ✅ Scenario 2: Account Creation (Unregistered Users)
- Registration page with username and password
- Form validation and error handling
- Secure password hashing using bcrypt

### ✅ Scenario 3: Authentication (Unregistered → Registered)
- Login system with JWT token-based authentication
- Secure session management
- Protected routes for authenticated users

### ✅ Scenario 4: Start Calculation Chain (Registered Users)
- Authenticated users can create new calculation trees
- Input initial number to start a discussion
- Automatic result calculation and tree initialization

### ✅ Scenario 5: Add Operations (Registered Users)
- Apply operations to any existing number in the tree
- Choose operation type: +, -, ×, ÷
- Input custom number as the right operand
- Automatic calculation: `previous_result operation user_number`

### ✅ Scenario 6: Respond to Calculations (Registered Users)
- Add operations to any node in any calculation tree
- Create branching discussions
- Real-time updates visible to all users

## 🛠 Technology Stack

### Required Technologies (Met)
- ✅ **Node.js** - Backend runtime environment
- ✅ **TypeScript** - Type-safe development for both frontend and backend
- ✅ **React** - Frontend UI framework with component-based architecture
- ✅ **Docker** - Containerized deployment (Railway platform)

### Backend
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database for data persistence
- **Socket.io** - Real-time bidirectional communication
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcrypt** - Password hashing
- **Sequelize** - ORM for database operations
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **Radix UI** - Unstyled, accessible components
- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time WebSocket client
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing

### DevOps & Deployment
- **Docker** - Multi-stage builds for production
- **Railway** - Cloud deployment platform
- **GitHub Actions** - CI/CD automation
- **nginx** - Production web server

## 🏗 Architecture

### System Design
```
┌─────────────┐      HTTP/WebSocket      ┌─────────────┐
│   React     │ ◄──────────────────────► │  Express    │
│  Frontend   │                           │   Backend   │
└─────────────┘                           └──────┬──────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │ PostgreSQL  │
                                          │  Database   │
                                          └─────────────┘
```

### Database Schema
- **Users** - Authentication and user management
- **Calculations** - Starting numbers and operation chains
- **Operations** - Individual mathematical operations in the tree

### Communication Protocol
- **REST API** - CRUD operations for calculations and operations
- **WebSocket** - Real-time updates using Socket.io
- **JWT Authentication** - Secure token-based auth

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm or yarn

### Local Development with Docker

```bash
# Clone the repository
git clone https://github.com/amaralkaff/calculation-tree-application.git
cd calculation-tree-application

# Start all services
docker-compose up

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Manual Setup

#### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Start development server
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with API URL

# Start development server
npm run dev
```

## 🧪 Testing

The application includes testing setup:

```bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test
npm run test:coverage
```

**Test Coverage:**
- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for React components

## 📖 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - Create new user account
POST /api/auth/login    - Authenticate user
GET  /api/auth/me       - Get current user (protected)
```

### Calculation Endpoints
```
GET    /api/calculations     - Get all calculation trees
POST   /api/calculations     - Create new calculation (protected)
GET    /api/calculations/:id - Get specific calculation tree
DELETE /api/calculations/:id - Delete calculation (protected)
```

### Operation Endpoints
```
POST   /api/operations      - Add operation to calculation (protected)
GET    /api/operations/:id  - Get specific operation
DELETE /api/operations/:id  - Delete operation (protected)
```

### WebSocket Events
```
calculation:created - New calculation tree started
operation:added     - New operation added to tree
calculation:updated - Tree structure updated
```

## 🎨 Component Architecture

### Frontend Components
- **Modular Design** - Reusable React components
- **Separation of Concerns** - Presentational vs Container components
- **State Management** - Zustand for global state
- **Custom Hooks** - Reusable logic extraction

### Key Components
- `CalculationTree` - Displays tree structure
- `CalculationNode` - Individual number/operation node
- `OperationForm` - Add new operations
- `AuthForm` - Login/Register forms
- `ProtectedRoute` - Authentication guard

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure authentication
- **CORS Protection** - Configured for production
- **SQL Injection Prevention** - Parameterized queries via Sequelize
- **XSS Protection** - Input sanitization
- **HTTPS** - Enforced in production

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Google Chrome (Latest) - Primary target
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)

## 📝 Design Decisions

### Why These Technologies?

1. **TypeScript** - Type safety reduces bugs and improves maintainability
2. **React** - Component-based architecture and large ecosystem
3. **Express** - Lightweight, flexible, and well-documented
4. **PostgreSQL** - Relational data model fits the tree structure perfectly
5. **Socket.io** - Simplifies real-time communication
6. **Tailwind CSS** - Rapid UI development with utility classes
7. **Docker** - Consistent development and deployment environments

### Architecture Choices

1. **Monorepo Structure** - Frontend and backend in one repository for easier management
2. **JWT Authentication** - Stateless authentication scales well
3. **WebSocket Updates** - Real-time collaboration without polling
4. **Component Library** - shadcn/ui for consistent, accessible UI
5. **Zustand State Management** - Lightweight alternative to Redux

## 🚀 Deployment

The application is deployed on Railway with:
- **Frontend** - Static site served via nginx
- **Backend** - Node.js service
- **Database** - PostgreSQL managed database
- **Environment Variables** - Secure configuration management
- **Automatic Deployments** - CI/CD via GitHub integration

## 📄 License

MIT

## 👤 Author

**[Your Name]**
- GitHub: [@amaralkaff](https://github.com/amaralkaff)
- Email: [Your Email]

## 📧 Submission

This project was created as a test assignment for the Full Stack Developer position at Ellty (Taskina Pty Ltd).

**Assignment Details:**
- **Position:** Full Stack Developer
- **Company:** Taskina Pty Ltd / Ellty
- **Submission Date:** [Current Date]
- **Development Time:** 48 hours
- **Contact:** julia@ellty.com

---

**Note:** This application demonstrates proficiency in modern web development practices, including component-based architecture, real-time communication, secure authentication, database design, and production deployment.
