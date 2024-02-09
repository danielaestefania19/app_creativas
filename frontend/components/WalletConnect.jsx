import React, { useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from './WalletContext.jsx';

const API_URL = import.meta.env.VITE_BACKEND_URL

// Configuración de ethers
const provider = new ethers.providers.JsonRpcProvider(API_URL);

const BITFINITY_CHAIN = {
    chainId: '0x' + parseInt(355113).toString(16), // Convertir a hexadecimal
    chainName: "Bitfinity Network",
    nativeCurrency: {
        name: "BitFinity",
        symbol: "BFT",
        decimals: 18,
    },
    rpcUrls: ["https://testnet.bitfinity.network"],
    //blockExplorerUrls: []
};

const WalletConnect = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const { setDefaultAccount } = useContext(WalletContext);

    const connectwalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then(async accounts => {
                const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
                await accountChangedHandler(signer);
    
                // Agregar la red Bitfinity si no está presente
                const chainIdHex = BITFINITY_CHAIN.chainId;
                const chainId = parseInt(chainIdHex, 16);
                const currentChainId = parseInt(await window.ethereum.request({ method: 'eth_chainId' }), 16);
                if (chainId !== currentChainId) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [BITFINITY_CHAIN],
                        });
                    } catch (addError) {
                        console.log("Error al agregar la red Bitfinity: " + addError.message);
                    }
                }
            }).catch((err) => {
                setErrorMessage("Error connecting with Metamask: " + err.message);
            });
        } else {
            setErrorMessage("Please install Metamask!!!");
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

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', async (accounts) => {
                if (accounts.length === 0) {
                    // El usuario se ha desconectado
                    setDefaultAccount(null);
                } else {
                    // El usuario ha cambiado de cuenta
                    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
                    await accountChangedHandler(signer);
                }
            });

            window.ethereum.on('chainChanged', async () => {
                // El usuario ha cambiado de red, por lo que debemos actualizar la cuenta
                const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
                await accountChangedHandler(signer);
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, []);

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
