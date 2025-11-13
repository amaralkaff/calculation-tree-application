import axios, { AxiosInstance } from 'axios';
import { AuthResponse, CalculationNode, CreateCalculationInput } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Auth
  async register(username: string, password: string): Promise<AuthResponse> {
    const { data } = await this.api.post<AuthResponse>('/auth/register', {
      username,
      password,
    });
    return data;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const { data } = await this.api.post<AuthResponse>('/auth/login', {
      username,
      password,
    });
    return data;
  }

  async getMe(): Promise<{ user: User }> {
    const { data } = await this.api.get('/auth/me');
    return data;
  }

  // Calculations
  async getCalculations(): Promise<{ calculations: CalculationNode[] }> {
    const { data } = await this.api.get('/calculations');
    return data;
  }

  async getCalculation(id: number): Promise<{ calculation: CalculationNode }> {
    const { data } = await this.api.get(`/calculations/${id}`);
    return data;
  }

  async createCalculation(input: CreateCalculationInput): Promise<{ calculation: CalculationNode }> {
    const { data } = await this.api.post('/calculations', input);
    return data;
  }

  async deleteCalculation(id: number): Promise<void> {
    await this.api.delete(`/calculations/${id}`);
  }
}

export const api = new ApiService();

interface User {
  id: number;
  username: string;
}
