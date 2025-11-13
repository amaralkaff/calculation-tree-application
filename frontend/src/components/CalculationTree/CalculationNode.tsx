import { useState } from 'react';
import { CalculationNode as CalculationNodeType, OperationType } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useCalculationStore } from '../../store/useCalculationStore';
import './CalculationTree.css';

interface CalculationNodeProps {
  node: CalculationNodeType;
}

const operationSymbols: Record<OperationType, string> = {
  [OperationType.ADD]: '+',
  [OperationType.SUBTRACT]: '-',
  [OperationType.MULTIPLY]: '×',
  [OperationType.DIVIDE]: '÷',
};

export const CalculationNode = ({ node }: CalculationNodeProps) => {
  const [showForm, setShowForm] = useState(false);
  const [operation, setOperation] = useState<OperationType>(OperationType.ADD);
  const [operand, setOperand] = useState('');
  const { isAuthenticated, user } = useAuthStore();
  const { createCalculation, deleteCalculation, loading } = useCalculationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const operandNum = parseFloat(operand);
    if (isNaN(operandNum)) return;

    try {
      await createCalculation({
        parentId: node.id,
        operationType: operation,
        operand: operandNum,
      });
      setOperand('');
      setShowForm(false);
    } catch (error) {
      // Error handled by store
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this calculation and all its children?')) {
      try {
        await deleteCalculation(node.id);
      } catch (error) {
        // Error handled by store
      }
    }
  };

  const isOwner = user?.id === node.userId;

  return (
    <div className="calculation-node">
      <div className="node-content">
        <div className="node-info">
          <div className="node-header">
            <span className="username">{node.username}</span>
            <span className="timestamp">
              {new Date(node.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="calculation-display">
            {node.parentId !== null && node.operationType && (
              <span className="operation">
                {operationSymbols[node.operationType]} {node.operand} =
              </span>
            )}
            <span className="result">{node.result}</span>
          </div>

          <div className="node-actions">
            {isAuthenticated && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-small"
                disabled={loading}
              >
                {showForm ? 'Cancel' : 'Respond'}
              </button>
            )}
            {isAuthenticated && isOwner && (
              <button
                onClick={handleDelete}
                className="btn-small btn-danger"
                disabled={loading}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="operation-form">
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as OperationType)}
              className="operation-select"
            >
              <option value={OperationType.ADD}>Add (+)</option>
              <option value={OperationType.SUBTRACT}>Subtract (-)</option>
              <option value={OperationType.MULTIPLY}>Multiply (×)</option>
              <option value={OperationType.DIVIDE}>Divide (÷)</option>
            </select>

            <input
              type="number"
              step="any"
              value={operand}
              onChange={(e) => setOperand(e.target.value)}
              placeholder="Enter number"
              required
              className="number-input"
            />

            <button type="submit" className="btn-small btn-primary" disabled={loading}>
              Add
            </button>
          </form>
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <div className="children">
          {node.children.map((child) => (
            <CalculationNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};
