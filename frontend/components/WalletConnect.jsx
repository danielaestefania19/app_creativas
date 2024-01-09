import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { ethers } from 'ethers';

const API_URL = "https://testnet.bitfinity.network"

// Configuración de ethers
const provider = new ethers.providers.JsonRpcProvider(API_URL);

const WalletConnect = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);

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
        const balance = await newAccount.getBalance()
        setUserBalance(ethers.utils.formatEther(balance));
        await getuserBalance(address)
    }

    const getuserBalance = async (address) => {
        const balance = await provider.getBalance(address, "latest")
    }

    return (
        <div className="WalletCard">
            <h3 className="h4">
               Disfruta pagar con crypto
            </h3>
            <Button
                style={{ background: defaultAccount ? "#A5CC82" : "white" }}
                onClick={connectwalletHandler}>
                {defaultAccount ? "Connected!!" : "Connect"}
            </Button>
            <div className="displayAccount">
                <h4 className="walletAddress">Address:{defaultAccount}</h4>
                <div className="balanceDisplay">
                    <h3>
                        Wallet Amount: {userBalance}
                    </h3>
                </div>
            </div>
            {errorMessage}
        </div>
    )
}

export default WalletConnect;
