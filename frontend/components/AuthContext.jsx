import React, { createContext, useState } from 'react';
import { useAuth } from './Login'; // Importa useAuth aquí

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth(); // Usa useAuth aquí
  const [whoami, setWhoami] = useState(null);
  const [lastVisitedRoute, setLastVisitedRoute] = useState('/'); // Nuevo estado para la última ruta visitada

  return (
    <AuthContext.Provider value={{ ...auth, whoami, setWhoami, lastVisitedRoute, setLastVisitedRoute }}>
      {children}
    </AuthContext.Provider>
  );
};