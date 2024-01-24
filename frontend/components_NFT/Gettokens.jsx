import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import { contractAddressRES4 } from "../../utils/constans.js";
import Marketplace from "./Marketplace.jsx"
// import WalletContext from "./walletconext"
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
                const currentTime = Math.floor(Date.now() / 1000); // Obtén el tiempo actual en segundos

                if (asset.end_crowfunding > currentTime) {
                    // Si el end_crowfunding del activo aún no ha pasado, añádelo a newAssets
                    newAssets.push({ ...asset, owner, approval });
                } else {
                    // Si el end_crowfunding del activo ya ha pasado, llama a la función finalize
                    await contract.finalize(asset.assetId);
                    console.log(asset.assetId)
                }
            }
            setAssets(newAssets);
        };

        fetchAllAssets();
    }, []);

    return (
        <div className="flex flex-col items-end mt-32 mb-2 mr-5 h-full">
            {/* Contenedor del botón Ir a CreateTokens */}
            <div className="mb-4">
                <Link to="/other/createtokens">
                    <button className='bg-[#c9398a] rounded-md p-2 text-white' >Ir a CreateTokens</button>
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

