import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [whoami, setWhoami] = useState(null);

  return (
    <AuthContext.Provider value={{ whoami, setWhoami }}>
      {children}
    </AuthContext.Provider>
  );
};
