import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1A18] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#D4CCB8] border-t-transparent animate-spin rounded-full mx-auto mb-3" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4CCB8]">
            Verifying Admin Authorization...
          </span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
