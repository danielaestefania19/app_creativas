import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import { contractAddressRES4 } from "../../utils/constans.js";
import Marketplace from "./Marketplace.jsx"

const PRIVATE_KEY_NFT = import.meta.env.VITE_PRIVATE_KEY_NFT;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_NFT, provider);
const contract = new ethers.Contract(contractAddressRES4, RES4, wallet);

const FetchAllAssets = () => {
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        const fetchAllAssets = async () => {
            const length = await contract.assetsCount();
            const newAssets = [];
            for (let i = 0; i < length; i++) {
                const asset = await contract.assetMap(i);
                const owner = await contract.ownerOf(asset.assetId);
                const approval = await contract.assetApprovals(asset.assetId);
                newAssets.push({ ...asset, owner, approval });
            }
            setAssets(newAssets);
        };

        fetchAllAssets();
    }, []);

    return (
        <div className="flex flex-col  mt-4 mb-2 mr-2 h-full">
            {/* Contenedor del botón Ir a CreateTokens */}
            <div className="mb-4">
                <Link to="/other/createtokens">
                    <button className='bg-[#c9398a] rounded-md p-2 text-white items-end' >Ir a CreateTokens</button>
                </Link>
            </div>

            {/* Contenedor del componente Marketplace */}
            <div className="flex flex-wrap justify-center">
                <Marketplace assets={assets} />
            </div>
        </div>
    );
};
export default FetchAllAssets;
