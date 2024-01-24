import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import { contractAddressRES4 } from "../../utils/constans.js";
import { WalletContext } from '../components/WalletContext.jsx'; // Asegúrate de ajustar la ruta de importación
const PRIVATE_KEY_NFT = import.meta.env.VITE_PRIVATE_KEY_NFT;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_NFT, provider);
const contract = new ethers.Contract(contractAddressRES4, RES4, wallet);

const YourInvest = () => {
    const { defaultAccount } = useContext(WalletContext);
    const [investedAssets, setInvestedAssets] = useState([]);

    useEffect(() => {
        const fetchInvestedAssets = async () => {
            const length = await contract.assetsCount();
            const newInvestedAssets = [];
            for (let i = 0; i < length; i++) {
                const asset = await contract.assetMap(i);
                const investment = await contract.investmentAmountOf(i, defaultAccount);
                if (investment > 0) {
                    const status = await contract.projectStatus(i);
                    const outcome = await contract.fundingOutcome(i);
                    newInvestedAssets.push({ ...asset, status, outcome });
                }
            }
            setInvestedAssets(newInvestedAssets);
        };

        fetchInvestedAssets();
    }, [defaultAccount]);

    const handleRefund = async (assetId) => {
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contractWithSigner = contract.connect(signer);
        const gasLimit = ethers.utils.hexlify(300000);
        const transaction = await contractWithSigner.withdraw(assetId, { gasLimit });
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
                </div>
            ))}
        </div>
    );
};

export default YourInvest;
