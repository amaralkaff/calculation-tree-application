import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { OperationType } from '../types';

interface CalculationAttributes {
  id: number;
  userId: number;
  parentId: number | null;
  operationType: OperationType | null;
  operand: number;
  result: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CalculationCreationAttributes extends Optional<CalculationAttributes, 'id'> {}

export class Calculation extends Model<CalculationAttributes, CalculationCreationAttributes> implements CalculationAttributes {
  public id!: number;
  public userId!: number;
  public parentId!: number | null;
  public operationType!: OperationType | null;
  public operand!: number;
  public result!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static calculateResult(parentResult: number, operation: OperationType, operand: number): number {
    switch (operation) {
      case OperationType.ADD:
        return parentResult + operand;
      case OperationType.SUBTRACT:
        return parentResult - operand;
      case OperationType.MULTIPLY:
        return parentResult * operand;
      case OperationType.DIVIDE:
        if (operand === 0) {
          throw new Error('Division by zero is not allowed');
        }
        return parentResult / operand;
      default:
        throw new Error('Invalid operation type');
    }
  }
}

Calculation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'calculations',
        key: 'id',
      },
    },
    operationType: {
      type: DataTypes.ENUM(...Object.values(OperationType)),
      allowNull: true,
    },
    operand: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    result: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'calculations',
    timestamps: true,
  }
);

// Associations
User.hasMany(Calculation, { foreignKey: 'userId', as: 'calculations' });
Calculation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Calculation.hasMany(Calculation, { foreignKey: 'parentId', as: 'children' });
Calculation.belongsTo(Calculation, { foreignKey: 'parentId', as: 'parent' });
