import { io, Socket } from 'socket.io-client';
import { CalculationNode } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('calculation:new', (data: CalculationNode) => {
      this.emit('calculation:new', data);
    });

    this.socket.on('calculation:removed', (data: { id: number }) => {
      this.emit('calculation:removed', data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  emitCalculationCreated(calculation: CalculationNode): void {
    this.socket?.emit('calculation:created', calculation);
  }

  emitCalculationDeleted(id: number): void {
    this.socket?.emit('calculation:deleted', { id });
  }
}

export const socketService = new SocketService();
