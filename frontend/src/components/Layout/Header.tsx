import { useAuthStore } from '../../store/useAuthStore';
import './Layout.css';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">Calculation Tree</h1>

        {isAuthenticated && user && (
          <div className="user-section">
            <span className="user-name">Welcome, {user.username}</span>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
