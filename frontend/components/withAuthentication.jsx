import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useContext } from 'react';
import { AuthContext } from './AuthContext'; 

const withAuthentication = (Component) => {
  return (props) => {
    const { isUserAuthenticated, setLastVisitedRoute } = useContext(AuthContext); 
    const navigate = useNavigate();
    const location = useLocation(); 

    useEffect(() => {
      if (!isUserAuthenticated) {
        setLastVisitedRoute(location.pathname); 
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
