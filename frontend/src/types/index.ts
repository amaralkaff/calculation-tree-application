export enum OperationType {
  ADD = 'add',
  SUBTRACT = 'subtract',
  MULTIPLY = 'multiply',
  DIVIDE = 'divide',
}

export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface CalculationNode {
  id: number;
  userId: number;
  username: string;
  parentId: number | null;
  operationType: OperationType | null;
  operand: number;
  result: number;
  createdAt: string;
  children?: CalculationNode[];
}

export interface CreateCalculationInput {
  parentId?: number;
  operationType?: OperationType;
  operand: number;
}
