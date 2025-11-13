import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calculation Tree</h1>

        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user.username}</span>
            </span>
            <Button onClick={logout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
