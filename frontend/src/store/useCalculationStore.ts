import { create } from 'zustand';
import { api } from '../services/api';
import { socketService } from '../services/socket';
import { CalculationNode, CreateCalculationInput } from '../types';

interface CalculationState {
  calculations: CalculationNode[];
  loading: boolean;
  error: string | null;
  fetchCalculations: () => Promise<void>;
  createCalculation: (input: CreateCalculationInput) => Promise<void>;
  deleteCalculation: (id: number) => Promise<void>;
  clearError: () => void;
  addCalculation: (calculation: CalculationNode) => void;
  removeCalculation: (id: number) => void;
}

export const useCalculationStore = create<CalculationState>((set, get) => ({
  calculations: [],
  loading: false,
  error: null,

  fetchCalculations: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.getCalculations();
      set({ calculations: response.calculations, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch calculations',
        loading: false,
      });
    }
  },

  createCalculation: async (input: CreateCalculationInput) => {
    try {
      set({ loading: true, error: null });
      const response = await api.createCalculation(input);

      // Emit to WebSocket
      socketService.emitCalculationCreated(response.calculation);

      // Refresh calculations
      await get().fetchCalculations();

      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to create calculation',
        loading: false,
      });
      throw error;
    }
  },

  deleteCalculation: async (id: number) => {
    try {
      set({ loading: true, error: null });
      await api.deleteCalculation(id);

      // Emit to WebSocket
      socketService.emitCalculationDeleted(id);

      // Refresh calculations
      await get().fetchCalculations();

      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to delete calculation',
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  addCalculation: (_calculation: CalculationNode) => {
    get().fetchCalculations();
  },

  removeCalculation: (_id: number) => {
    get().fetchCalculations();
  },
}));
