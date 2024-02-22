import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useContext } from 'react';
import { AuthContext } from './AuthContext'; 
import { WalletContext } from './WalletContext.jsx';




const withAuthenticationAndWallet = (WrappedComponent) => {
  return (props) => {
    const { isUserAuthenticated } = useContext(AuthContext);
    const { defaultAccount } = useContext(WalletContext);
    const navigate = useNavigate();

    const isWalletConnected = () => {
      return defaultAccount !== null;
    };

    if (!isUserAuthenticated && !isWalletConnected()) {
      alert('Debes estar autenticado y conectar tu wallet para acceder a esta página.');
      return null;
    }

    if (!isUserAuthenticated) {
      alert('Debes estar autenticado para acceder a esta página.');
      return null;
    }

    if (!isWalletConnected()) {
      alert('Debes conectar tu wallet para acceder a esta página.');
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthenticationAndWallet ;
