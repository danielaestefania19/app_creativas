import React, { createContext, useState } from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [defaultAccount, setDefaultAccount] = useState(null);

    return (
        <WalletContext.Provider value={{ defaultAccount, setDefaultAccount }}>
            {children}
        </WalletContext.Provider>
    );
};
