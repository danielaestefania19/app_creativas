import React, { useState, useEffect } from 'react';
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
            for(let i = 0; i < length; i++) {
                const asset = await contract.assetMap(i);
                const owner = await contract.ownerOf(asset.assetId);
                const approval = await contract.assetApprovals(asset.assetId);
                newAssets.push({ ...asset, owner, approval });
            }
            setAssets(newAssets);
        };

        fetchAllAssets();
    }, []);

    return <Marketplace assets={assets} />;
};

export default FetchAllAssets;