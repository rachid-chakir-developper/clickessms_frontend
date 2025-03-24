import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../context/SessionProvider';

const AuthGuardRoute = ({ authenticated, mustChangePassword, guest, children, ...props }) => {
  const { user } = useSession();

  if (authenticated && !user) {
    // Si l'utilisateur n'est pas authentifié et la route nécessite une authentification,
    // naviguer vers la page de connexion
    return <Navigate to="/login" replace />;
  }
  if (authenticated && user && user?.isMustChangePassword) {
    // Si l'utilisateur n'est pas authentifié et la route nécessite une authentification,
    // naviguer vers la page de connexion
    return <Navigate to="/connexion/changer-mot-de-passe" replace />;
  }
  if ((guest && user) || (mustChangePassword && user && !user?.isMustChangePassword)) {
    // Si l'utilisateur n'est pas authentifié et la route nécessite une authentification,
    // naviguer vers la page de connexion
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AuthGuardRoute;
