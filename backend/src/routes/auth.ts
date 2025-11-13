import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthenticatedRequest, RegisterInput, LoginInput } from '../types';
import { AppError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register
router.post('/register', async (req: express.Request, res: Response, next) => {
  try {
    const { username, password }: RegisterInput = req.body;

    if (!username || !password) {
      throw new AppError('Username and password are required', 400);
    }

    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new AppError('Username already exists', 409);
    }

    const user = await User.create({ username, password });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' } // 7 days
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req: express.Request, res: Response, next) => {
  try {
    const { username, password }: LoginInput = req.body;

    if (!username || !password) {
      throw new AppError('Username and password are required', 400);
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' } // 7 days
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'createdAt'],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;
