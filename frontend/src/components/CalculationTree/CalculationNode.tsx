import { useState } from 'react';
import { CalculationNode as CalculationNodeType, OperationType } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useCalculationStore } from '../../store/useCalculationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CalculationNodeProps {
  node: CalculationNodeType;
}

const operationSymbols: Record<OperationType, string> = {
  [OperationType.ADD]: '+',
  [OperationType.SUBTRACT]: '-',
  [OperationType.MULTIPLY]: '×',
  [OperationType.DIVIDE]: '÷',
};

const operationLabels: Record<OperationType, string> = {
  [OperationType.ADD]: 'Add (+)',
  [OperationType.SUBTRACT]: 'Subtract (-)',
  [OperationType.MULTIPLY]: 'Multiply (×)',
  [OperationType.DIVIDE]: 'Divide (÷)',
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
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium">{node.username}</CardTitle>
              <CardDescription className="text-xs">
                {new Date(node.createdAt).toLocaleString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            {node.parentId !== null && node.operationType && (
              <span className="text-muted-foreground">
                {operationSymbols[node.operationType]} {node.operand} =
              </span>
            )}
            <span className="text-primary">{node.result}</span>
          </div>

          <div className="flex gap-2">
            {isAuthenticated && (
              <Button
                onClick={() => setShowForm(!showForm)}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                {showForm ? 'Cancel' : 'Respond'}
              </Button>
            )}
            {isAuthenticated && isOwner && (
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                disabled={loading}
              >
                Delete
              </Button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t">
              <div className="flex gap-2">
                <Select value={operation} onValueChange={(value) => setOperation(value as OperationType)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OperationType.ADD}>{operationLabels[OperationType.ADD]}</SelectItem>
                    <SelectItem value={OperationType.SUBTRACT}>{operationLabels[OperationType.SUBTRACT]}</SelectItem>
                    <SelectItem value={OperationType.MULTIPLY}>{operationLabels[OperationType.MULTIPLY]}</SelectItem>
                    <SelectItem value={OperationType.DIVIDE}>{operationLabels[OperationType.DIVIDE]}</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  step="any"
                  value={operand}
                  onChange={(e) => setOperand(e.target.value)}
                  placeholder="Enter number"
                  required
                  className="flex-1"
                />

                <Button type="submit" size="sm" disabled={loading}>
                  Add
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {node.children && node.children.length > 0 && (
        <div className="ml-6 space-y-4 border-l-2 border-muted pl-6">
          {node.children.map((child) => (
            <CalculationNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};
