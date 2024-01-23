import React, { useEffect, useState, useContext } from "react";
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import { contractAddressRES4 } from "../../utils/constans.js";
import FractionalNFT from "../../utils/abi/FractionalNFT.json"
import { WalletContext } from '../components/WalletContext.jsx'; // Asegúrate de ajustar la ruta de importación
import { assert } from "chai";

const PRIVATE_KEY_NFT = import.meta.env.VITE_PRIVATE_KEY_NFT;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_NFT, provider);
const contract_RES4 = new ethers.Contract(contractAddressRES4, RES4, wallet);
// // const contract_FracNFT = new ethers.Contract(contractAddressTransfer, TransferEther, provider);

const ShowdetailsTokensFrac = ({ id, precio, NFTFractional, propietario }) => {
    const [tokenAmount, setTokenAmount] = useState(1);
    const [purchasedTokens, setPurchasedTokens] = useState({});
    const { defaultAccount } = useContext(WalletContext);

    console.log(id)
  
    const handleTokenAmountChange = (event) => {
      setTokenAmount(event.target.value);
    };
  console.log(id, precio, NFTFractional, propietario);
    // Calcula el total a pagar para este activo
    const amount = parseFloat(precio) / parseFloat(NFTFractional) * tokenAmount;

    const invest = async (assetId, amount) => {
      try {
          let wei = ethers.utils.parseEther(amount.toString());
          const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
          const contractWithSigner = contract_RES4.connect(signer);
          const gasLimit = ethers.utils.hexlify(300000);
          console.log(assetId)
          const transaction = await contractWithSigner.invest(assetId, wei, { gasLimit, value: wei });
          const receipt = await transaction.wait();
          console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
          setPurchasedTokens({ ...purchasedTokens, [assetId]: true });
      } catch (error) {
          console.error(`Failed to send transaction: ${error}`);
      }
  };

    const activos = async (activoId, receiver, amount) => {
        const dirtoken = await contract_RES4.FCTV(activoId);
        console.log(dirtoken)
        const addrFCTV = dirtoken.fractionalToken;
        const contFCTV = new ethers.Contract(addrFCTV, FractionalNFT, wallet);

        return await signTransaction(receiver, amount, addrFCTV, contFCTV);
    };

    const signTransaction = async (receiver, amount, addrFCTV, contFCTV) => {
        const value = ethers.utils.parseEther(amount.toString());
        const gasLimit = ethers.utils.hexlify(100000);
        const transaction = await contFCTV.transfer(receiver, value, { gasLimit });
        const receipt = await transaction.wait();

        return receipt.transactionHash;
    };

    return (
    <div>
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {[...Array(parseInt(NFTFractional))].map((_, i) => (
            <button
              key={i}
              style={{ width: 50, height: 50, backgroundColor: 'blue', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 5 }}
              disabled={purchasedTokens[propietario] || tokenAmount > NFTFractional}
              onClick={async () => {
                const amount = parseFloat(precio) / parseFloat(NFTFractional) * tokenAmount;
               
                  await invest(id, amount.toString());
                  console.log(tokenAmount)
                  const txHash = await activos(id, defaultAccount, tokenAmount);
                  console.log(`Transaction hash: ${txHash}`);

                  console.error(`Investment failed: ${error}`);
              
              
              }}
            >
              Transfer {parseFloat(precio) / parseFloat(NFTFractional) * tokenAmount}
            </button>
          ))}
        </div>
        <p>Total a pagar: {amount}</p>
        <input type="number" value={tokenAmount} onChange={handleTokenAmountChange} min="1" max={NFTFractional} />
      </div>
    </div>
  );
};

export default ShowdetailsTokensFrac;