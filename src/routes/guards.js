import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

// Loading spinner while auth is being restored from session
function AuthLoading() {
  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AuthLoading />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AuthLoading />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

export function RedirectIfAuth({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  return children;
}
