import { useEffect, useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { Header } from './components/Layout/Header';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { CalculationTree } from './components/CalculationTree/CalculationTree';
import './App.css';

type AuthView = 'login' | 'register' | null;

function App() {
  const [authView, setAuthView] = useState<AuthView>(null);
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    setAuthView(null);
  };

  if (authView === 'login') {
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  if (authView === 'register') {
    return <Register onSwitchToLogin={() => setAuthView('login')} />;
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {!isAuthenticated && (
          <div className="auth-prompt">
            <p>View calculation trees as a guest or</p>
            <div className="auth-buttons">
              <button onClick={() => setAuthView('login')} className="btn-primary">
                Login
              </button>
              <button onClick={() => setAuthView('register')} className="btn-secondary">
                Register
              </button>
            </div>
          </div>
        )}

        <CalculationTree />
      </main>
    </div>
  );
}

export default App;
