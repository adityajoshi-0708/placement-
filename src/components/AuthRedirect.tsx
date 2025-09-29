import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Index from '@/pages/Index';

export const AuthRedirect: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Redirect to appropriate dashboard based on role
      switch (currentUser.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'mentor':
          navigate('/mentor/dashboard');
          break;
        case 'placement_officer':
          navigate('/placement/dashboard');
          break;
        case 'employer':
          navigate('/employer/dashboard');
          break;
        default:
          navigate('/login');
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  // If not authenticated, show the landing page
  return <Index />;
};