import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

export enum OperationType {
  ADD = 'add',
  SUBTRACT = 'subtract',
  MULTIPLY = 'multiply',
  DIVIDE = 'divide',
}

export interface CalculationNode {
  id: number;
  userId: number;
  username: string;
  parentId: number | null;
  operationType: OperationType | null;
  operand: number;
  result: number;
  createdAt: Date;
  children?: CalculationNode[];
}

export interface RegisterInput {
  username: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface CreateCalculationInput {
  parentId?: number;
  operationType?: OperationType;
  operand: number;
}
