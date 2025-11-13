import { useEffect, useState } from 'react';
import { useCalculationStore } from '../../store/useCalculationStore';
import { useAuthStore } from '../../store/useAuthStore';
import { socketService } from '../../services/socket';
import { CalculationNode } from './CalculationNode';
import './CalculationTree.css';

export const CalculationTree = () => {
  const [showStartForm, setShowStartForm] = useState(false);
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
      setShowStartForm(false);
    } catch (error) {
      // Error handled by store
    }
  };

  if (loading && calculations.length === 0) {
    return <div className="loading">Loading calculations...</div>;
  }

  return (
    <div className="calculation-tree-container">
      <div className="tree-header">
        <h2>Calculation Trees</h2>
        {isAuthenticated && (
          <button
            onClick={() => setShowStartForm(!showStartForm)}
            className="btn-primary"
            disabled={loading}
          >
            {showStartForm ? 'Cancel' : 'Start New Chain'}
          </button>
        )}
      </div>

      {showStartForm && (
        <form onSubmit={handleStartCalculation} className="start-form">
          <input
            type="number"
            step="any"
            value={startNumber}
            onChange={(e) => setStartNumber(e.target.value)}
            placeholder="Enter starting number"
            required
            className="number-input"
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            Start
          </button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="calculations-list">
        {calculations.length === 0 ? (
          <div className="empty-state">
            <p>No calculations yet. {isAuthenticated && 'Start a new chain!'}</p>
          </div>
        ) : (
          calculations.map((calc) => <CalculationNode key={calc.id} node={calc} />)
        )}
      </div>
    </div>
  );
};
