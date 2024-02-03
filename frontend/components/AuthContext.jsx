import React, { createContext, useState } from 'react';
import { useAuth } from './Login';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth(); 
  const [whoami, setWhoami] = useState(null);
  const [lastVisitedRoute, setLastVisitedRoute] = useState('/'); 

  return (
    <AuthContext.Provider value={{ ...auth, whoami, setWhoami, lastVisitedRoute, setLastVisitedRoute }}>
      {children}
    </AuthContext.Provider>
  );
};