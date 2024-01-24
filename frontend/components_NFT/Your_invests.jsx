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
                    // Si el usuario ha invertido en este activo, añádelo a newInvestedAssets
                    newInvestedAssets.push(asset);
                }
            }
            setInvestedAssets(newInvestedAssets);
        };

        fetchInvestedAssets();
    }, [defaultAccount]); // Dependencia en defaultAccount para que se vuelva a ejecutar si cambia

    return (
        <div>
            <h2>Tus inversiones</h2>
            {investedAssets.map((asset, index) => (
                <div key={index}>
                    <h3>{asset.titulo}</h3>
                    <p>{asset.small_description}</p>
                </div>
            ))}
        </div>
    );
};

export default YourInvest;