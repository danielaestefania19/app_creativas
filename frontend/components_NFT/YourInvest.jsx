import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import FractionalNFT from "../../utils/abi/FractionalNFT.json"
import { contractAddressRES4 } from "../../utils/constans.js";
import { WalletContext } from '../components/WalletContext.jsx'; 
import { contractAddressReclamarFracRegistry } from "../../utils/constans.js";
import ReclamarFracRegistry from '../../utils/abi/ReclamarFracRegistry.json'
// Asegúrate de ajustar la ruta de importación
const PRIVATE_KEY_NFT = import.meta.env.VITE_PRIVATE_KEY_NFT;
const API_URL = import.meta.env.VITE_BACKEND_URL;
const PRIVATE_KEY_REGISTRY_FRAC = import.meta.env.VITE_PRIVATE_KEY_REGISTRY_FRAC

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_NFT, provider);
const contract_RES4 = new ethers.Contract(contractAddressRES4, RES4, wallet);
const wallet_registry = new ethers.Wallet(PRIVATE_KEY_REGISTRY_FRAC, provider);
const contract_Registry = new ethers.Contract(contractAddressReclamarFracRegistry, ReclamarFracRegistry, wallet_registry);


const YourInvest = () => {
    const { defaultAccount } = useContext(WalletContext);
    const [investedAssets, setInvestedAssets] = useState([]);
    

    useEffect(() => {
        const fetchInvestedAssets = async () => {
            const length = await contract_RES4.assetsCount();
            const newInvestedAssets = [];
            for (let i = 0; i < length; i++) {
                const asset = await contract_RES4.assetMap(i);
                const owner = await contract_RES4.ownerOf(asset.assetId);
                const investment = await contract_RES4.investmentAmountOf(i, defaultAccount);
                if (investment > 0) {
                    const status = await contract_RES4.projectStatus(i);
                    const outcome = await contract_RES4.fundingOutcome(i);
                    newInvestedAssets.push({ ...asset, status, outcome, owner });
                }
            }
            setInvestedAssets(newInvestedAssets);
        };

        fetchInvestedAssets();
    }, [defaultAccount]);

    const handleRefund = async (assetId) => {
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contractWithSigner = contract_RES4.connect(signer);
        const gasLimit = ethers.utils.hexlify(300000);
        const transaction = await contractWithSigner.withdraw(assetId, { gasLimit });
        const receipt = await transaction.wait();
        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
    };

    const canjeartokens = async (activoId) => {
        const dirtoken = await contract_RES4.FCTV(activoId);
        const addrFCTV = dirtoken.fractionalToken;
        const contFCTV = new ethers.Contract(addrFCTV, FractionalNFT, wallet);
        // Obtiene el balance del usuario
        const balance = await contFCTV.balanceOf(defaultAccount);

        console.log(`El usuario tiene ${ethers.utils.formatUnits(balance)} tokens.`);

        const spender = await contract_Registry.getContractAddress(assetId);

        console.log(`La dirección del contrato para el assetId ${assetId} es ${spender}`);

        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contractWithSigner = contFCTV.connect(signer);
        const gasLimit = ethers.utils.hexlify(100000);
        const transaction = await contractWithSigner.approve(spender, { gasLimit, value: balance });
        const receipt = await transaction.wait();
        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
    };





    return (
        <div>
            <h2>Tus inversiones</h2>
            {investedAssets.map((asset, index) => (
                <div key={index}>
                    <h2>NFT ID #{ethers.utils.formatUnits(asset.assetId, 0)}</h2>
                    <h3>{asset.titulo}</h3>
                    <p>{asset.small_description}</p>
                    <p>Estado del proyecto: {asset.status}</p>
                    <p>Resultado de la financiación: {asset.outcome}</p>
                    {asset.outcome === "Funding_Failed" && (
                        <button onClick={() => handleRefund(asset.assetId)}>
                            Rembolsar inversión
                        </button>
                        )}
                        {asset.status === "End_Crowfunding_Asset" && (
                        <button onClick={() => canjeartokens(asset.assetId)}>Canjear tokenss</button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default YourInvest;
