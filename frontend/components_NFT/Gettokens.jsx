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
    const [finalizingAssets, setFinalizingAssets] = useState({}); // Nuevo estado para los activos que están siendo finalizados

    useEffect(() => {
        const fetchAllAssets = async () => {
            const length = await contract.assetsCount();
            const newAssets = [];
            const finalizePromises = []; // Almacena las promesas de finalize
    
            for (let i = 0; i < length; i++) {
                const asset = await contract.assetMap(i);
                const owner = await contract.ownerOf(asset.assetId);
                const approval = await contract.assetApprovals(asset.assetId);
                const status = await contract.projectStatus(asset.assetId); // Obtén el estado del proyecto
    
                // Verificar si la financiacion del proyecto ha terminando
                const endCrowfundingAsset = Math.floor(Date.now() / 1000) > asset.end_crowfunding;
    
                // Si la financiacion del proyecto ha terminado y el estado del proyecto no es "End_Crowfunding_Asset"
                if (endCrowfundingAsset && status !== "End_Crowfunding_Asset" && !finalizingAssets[asset.assetId]) {
                    setFinalizingAssets(prevState => ({ ...prevState, [asset.assetId]: true })); // Añade el activo al estado de finalización
                    finalizePromises.push(contract.finalize(asset.assetId)); // Añade la promesa de finalize al array
                }
    
                // Solo añade el activo si su estado no es "End_Crowfunding_Asset"
                if (status !== "End_Crowfunding_Asset") {
                    newAssets.push({ ...asset, owner, approval });
                }
            }
    
            // Espera a que todas las promesas de finalize se resuelvan
            await Promise.allSettled(finalizePromises);
    
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
            <div className="mb-4">
                <Link to="/other/invests">
                    <button className='bg-[#c9398a] rounded-md p-2 text-white' >Tus inversiones</button>
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
