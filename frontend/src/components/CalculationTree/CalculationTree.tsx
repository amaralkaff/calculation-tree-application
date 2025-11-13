import { useEffect, useState } from 'react';
import { useCalculationStore } from '../../store/useCalculationStore';
import { useAuthStore } from '../../store/useAuthStore';
import { socketService } from '../../services/socket';
import { CalculationNode } from './CalculationNode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const CalculationTree = () => {
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [startNumber, setStartNumber] = useState('');
  const { calculations, loading, error, fetchCalculations, createCalculation, addCalculation, removeCalculation } = useCalculationStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchCalculations();

    // WebSocket listeners
    const handleNewCalculation = (data: any) => {
      addCalculation(data);
    };

    const handleRemovedCalculation = (data: any) => {
      removeCalculation(data.id);
    };

    socketService.connect();
    socketService.on('calculation:new', handleNewCalculation);
    socketService.on('calculation:removed', handleRemovedCalculation);

    return () => {
      socketService.off('calculation:new', handleNewCalculation);
      socketService.off('calculation:removed', handleRemovedCalculation);
    };
  }, []);

  const handleStartCalculation = async (e: React.FormEvent) => {
    e.preventDefault();

    const num = parseFloat(startNumber);
    if (isNaN(num)) return;

    try {
      await createCalculation({ operand: num });
      setStartNumber('');
      setShowStartDialog(false);
    } catch (error) {
      // Error handled by store
    }
  };

  if (loading && calculations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading calculations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Calculation Trees</h2>
        {isAuthenticated && (
          <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
            <DialogTrigger asChild>
              <Button disabled={loading}>Start New Chain</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Calculation Chain</DialogTitle>
                <DialogDescription>
                  Enter a starting number to begin a new calculation tree
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleStartCalculation}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startNumber">Starting Number</Label>
                    <Input
                      id="startNumber"
                      type="number"
                      step="any"
                      value={startNumber}
                      onChange={(e) => setStartNumber(e.target.value)}
                      placeholder="Enter starting number"
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setShowStartDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Starting...' : 'Start'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {error && (
        <div className="mb-6 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {calculations.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <div className="text-muted-foreground text-lg">
              No calculations yet.
              {isAuthenticated && (
                <div className="mt-2">
                  Click <span className="font-semibold">"Start New Chain"</span> to begin!
                </div>
              )}
            </div>
          </div>
        ) : (
          calculations.map((calc) => <CalculationNode key={calc.id} node={calc} />)
        )}
      </div>
    </div>
  );
};
