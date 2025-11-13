import { useEffect, useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { Header } from './components/Layout/Header';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { CalculationTree } from './components/CalculationTree/CalculationTree';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AuthView = 'login' | 'register' | null;

function App() {
  const [authView, setAuthView] = useState<AuthView>(null);
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // Auto-navigate to home after successful authentication
  useEffect(() => {
    if (isAuthenticated && authView !== null) {
      setAuthView(null);
    }
  }, [isAuthenticated, authView]);

  if (authView === 'login') {
    return (
      <>
        <Header />
        <Login onSwitchToRegister={() => setAuthView('register')} />
      </>
    );
  }

  if (authView === 'register') {
    return (
      <>
        <Header />
        <Register onSwitchToLogin={() => setAuthView('login')} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {!isAuthenticated && (
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Welcome to Calculation Tree</CardTitle>
                <CardDescription>
                  View calculation trees as a guest or create an account to participate
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 justify-center">
                <Button onClick={() => setAuthView('login')}>
                  Login
                </Button>
                <Button onClick={() => setAuthView('register')} variant="outline">
                  Register
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <CalculationTree />
      </main>
    </div>
  );
}

export default App;
