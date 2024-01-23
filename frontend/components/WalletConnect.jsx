import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from './WalletContext.jsx';

const API_URL = import.meta.env.VITE_BACKEND_URL

// Configuración de ethers
const provider = new ethers.providers.JsonRpcProvider(API_URL);

const WalletConnect = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const { setDefaultAccount } = useContext(WalletContext);

    const connectwalletHandler = () => {
      if (window.ethereum) {
          window.ethereum.request({ method: 'eth_requestAccounts' }).then(async accounts => {
              const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
              await accountChangedHandler(signer);
          }).catch((err) => {
              setErrorMessage("Error al conectar con Metamask: " + err.message);
          });
      } else {
          setErrorMessage("Por favor, instala Metamask!!!");
      }
    }
  
    const accountChangedHandler = async (newAccount) => {
        const address = await newAccount.getAddress();
        setDefaultAccount(address);
        await getuserBalance(address)
    }

    const getuserBalance = async (address) => {
        const balance = await provider.getBalance(address, "latest")
    }

    return (
        <div className="WalletCard" onClick={connectwalletHandler}>
            <button className='flex-1 ms-3 whitespace-nowrap'>
                Metamask
            </button>
            {errorMessage}
        </div>
    )
}

export default WalletConnect;
