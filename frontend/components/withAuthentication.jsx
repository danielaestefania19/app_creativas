import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Importa useLocation aquí
import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Importa AuthContext aquí

const withAuthentication = (Component) => {
  return (props) => {
    const { isUserAuthenticated, setLastVisitedRoute } = useContext(AuthContext); // Usa useContext aquí
    const navigate = useNavigate();
    const location = useLocation(); // Obtiene la ubicación actual

    useEffect(() => {
      if (!isUserAuthenticated) {
        setLastVisitedRoute(location.pathname); // Guarda la ruta actual
        navigate('/login');
      }
    }, [isUserAuthenticated, navigate, location.pathname, setLastVisitedRoute]);

    if (!isUserAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default withAuthentication;
