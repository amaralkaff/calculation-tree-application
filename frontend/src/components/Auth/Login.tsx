import { useState, FormEvent } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import './Auth.css';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login = ({ onSwitchToRegister }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(username, password);
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="link-button">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};
