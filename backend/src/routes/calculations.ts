import express, { Response } from 'express';
import { Calculation } from '../models/Calculation';
import { User } from '../models/User';
import { AuthenticatedRequest, CreateCalculationInput, OperationType } from '../types';
import { AppError } from '../middleware/errorHandler';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Get all calculations with tree structure
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const calculations = await Calculation.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Build tree structure
    const calculationMap = new Map();
    const roots: any[] = [];

    calculations.forEach((calc) => {
      const calcObj = {
        id: calc.id,
        userId: calc.userId,
        username: (calc as any).user.username,
        parentId: calc.parentId,
        operationType: calc.operationType,
        operand: calc.operand,
        result: calc.result,
        createdAt: calc.createdAt,
        children: [],
      };

      calculationMap.set(calc.id, calcObj);
    });

    calculationMap.forEach((calc) => {
      if (calc.parentId === null) {
        roots.push(calc);
      } else {
        const parent = calculationMap.get(calc.parentId);
        if (parent) {
          parent.children.push(calc);
        }
      }
    });

    res.json({ calculations: roots });
  } catch (error) {
    next(error);
  }
});

// Get specific calculation with its children
router.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const { id } = req.params;

    const calculation = await Calculation.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
    });

    if (!calculation) {
      throw new AppError('Calculation not found', 404);
    }

    const children = await Calculation.findAll({
      where: { parentId: id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
    });

    res.json({
      calculation: {
        id: calculation.id,
        userId: calculation.userId,
        username: (calculation as any).user.username,
        parentId: calculation.parentId,
        operationType: calculation.operationType,
        operand: calculation.operand,
        result: calculation.result,
        createdAt: calculation.createdAt,
        children: children.map((child) => ({
          id: child.id,
          userId: child.userId,
          username: (child as any).user.username,
          operationType: child.operationType,
          operand: child.operand,
          result: child.result,
          createdAt: child.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create new calculation (starting number or operation)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { parentId, operationType, operand }: CreateCalculationInput = req.body;

    if (operand === undefined || operand === null) {
      throw new AppError('Operand is required', 400);
    }

    let result: number;
    let parent: Calculation | null = null;

    // Starting number (no parent)
    if (!parentId) {
      if (operationType) {
        throw new AppError('Starting number cannot have an operation type', 400);
      }
      result = operand;
    } else {
      // Operation on existing calculation
      if (!operationType) {
        throw new AppError('Operation type is required for non-starting calculations', 400);
      }

      if (!Object.values(OperationType).includes(operationType)) {
        throw new AppError('Invalid operation type', 400);
      }

      parent = await Calculation.findByPk(parentId);
      if (!parent) {
        throw new AppError('Parent calculation not found', 404);
      }

      try {
        result = Calculation.calculateResult(parent.result, operationType, operand);
      } catch (error) {
        if (error instanceof Error) {
          throw new AppError(error.message, 400);
        }
        throw error;
      }
    }

    const calculation = await Calculation.create({
      userId: req.user.id,
      parentId: parentId || null,
      operationType: operationType || null,
      operand,
      result,
    });

    const calculationWithUser = await Calculation.findByPk(calculation.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
    });

    res.status(201).json({
      message: 'Calculation created successfully',
      calculation: {
        id: calculationWithUser!.id,
        userId: calculationWithUser!.userId,
        username: (calculationWithUser as any).user.username,
        parentId: calculationWithUser!.parentId,
        operationType: calculationWithUser!.operationType,
        operand: calculationWithUser!.operand,
        result: calculationWithUser!.result,
        createdAt: calculationWithUser!.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Delete calculation (only owner can delete)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const { id } = req.params;

    const calculation = await Calculation.findByPk(id);
    if (!calculation) {
      throw new AppError('Calculation not found', 404);
    }

    if (calculation.userId !== req.user.id) {
      throw new AppError('You can only delete your own calculations', 403);
    }

    // Delete all children recursively
    await deleteCalculationAndChildren(calculation.id);

    res.json({ message: 'Calculation deleted successfully' });
  } catch (error) {
    next(error);
  }
});

async function deleteCalculationAndChildren(calculationId: number): Promise<void> {
  const children = await Calculation.findAll({ where: { parentId: calculationId } });

  for (const child of children) {
    await deleteCalculationAndChildren(child.id);
  }

  await Calculation.destroy({ where: { id: calculationId } });
}

export default router;
