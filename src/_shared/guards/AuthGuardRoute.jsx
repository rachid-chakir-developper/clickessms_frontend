import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSession } from '../context/SessionProvider';

const AuthGuardRoute = ({ authenticated, guest, children, ...props }) => {
  const { user } = useSession();

  if (authenticated && !user) {
    // Si l'utilisateur n'est pas authentifié et la route nécessite une authentification,
    // naviguer vers la page de connexion
    return <Navigate to="/login" replace/>;
  }
  if (guest && user) {
    // Si l'utilisateur n'est pas authentifié et la route nécessite une authentification,
    // naviguer vers la page de connexion
    return <Navigate to="/" replace/>;
  }
  return children;
};

export default AuthGuardRoute;
