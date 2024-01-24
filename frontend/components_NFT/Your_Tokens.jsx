import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import { contractAddressRES4 } from "../../utils/constans.js";
import Marketplace from "./Marketplace.jsx"
import { WalletContext } from '../components/WalletContext.jsx'; // Asegúrate de ajustar la ruta de importación
const PRIVATE_KEY_NFT = import.meta.env.VITE_PRIVATE_KEY_NFT;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_NFT, provider);
const contract = new ethers.Contract(contractAddressRES4, RES4, wallet);

const YourTokens = () => {
    const { defaultAccount } = useContext(WalletContext);
    const [ownedAssets, setOwnedAssets] = useState([]);

    useEffect(() => {
        const fetchOwnedAssets = async () => {
            const length = await contract.assetsCount();
            const newOwnedAssets = [];
            for (let i = 0; i < length; i++) {
                const asset = await contract.assetMap(i);
                const owner = await contract.ownerOf(i);

                if (owner === defaultAccount) {
                    // Si el usuario es el propietario de este activo, añádelo a newOwnedAssets
                    newOwnedAssets.push(asset);
                }
            }
            setOwnedAssets(newOwnedAssets);
        };

        fetchOwnedAssets();
    }, [defaultAccount]); // Dependencia en defaultAccount para que se vuelva a ejecutar si cambia

    return (
        <div>
            <h2>Tus Tokens</h2>
            {ownedAssets.map((asset, index) => (
                <div key={index}>
                    <h3>{asset.titulo}</h3>
                    <p>{asset.small_description}</p>
                </div>
            ))}
        </div>
    );
};

export default YourTokens;