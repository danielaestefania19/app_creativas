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
    const [finalizingAssets, setFinalizingAssets] = useState({}); 

    useEffect(() => {
        const fetchAllAssets = async () => {
            const length = await contract.assetsCount();
            const newAssets = [];
            const finalizePromises = []; 

            for (let i = 0; i < length; i++) {
                const asset = await contract.assetMap(i);
                const owner = await contract.ownerOf(asset.assetId);
                const approval = await contract.assetApprovals(asset.assetId);
                const status = await contract.projectStatus(asset.assetId); 
                const endCrowfundingAsset = Math.floor(Date.now() / 1000) > asset.end_crowfunding;
                
                if (endCrowfundingAsset && status !== "End_Crowfunding_Asset" && !finalizingAssets[asset.assetId]) {
                    setFinalizingAssets(prevState => ({ ...prevState, [asset.assetId]: true })); 
                    finalizePromises.push(contract.finalize(asset.assetId)); 
                }

                if (status !== "End_Crowfunding_Asset") {
                    newAssets.push({ ...asset, owner, approval });
                }
            }

            await Promise.allSettled(finalizePromises);

            setAssets(newAssets);
        };

        fetchAllAssets();
    }, []);


    return (
        <div className="flex flex-col items-center  mt-32 mb-8 mr-5 h-full">

            <div className="flex space-x-4 mb-4">
                <Link to="/other/createtokens">
                    <button className='bg-[#c9398a] rounded-md p-2 text-white' >Go to Create Tokens</button>
                </Link>
                <Link to="/other/invests">
                    <button className='bg-[#c9398a] rounded-md p-2 text-white' >Your investments</button>
                </Link>
                <Link to="/other/tokens">
                    <button className='bg-[#c9398a] rounded-md p-2 text-white' >Your Tokens</button>
                </Link>
            </div>
            <div className="flex flex-wrap justify-center">
                <Marketplace assets={assets} />
            </div>
        </div>
    );
};
export default FetchAllAssets;

