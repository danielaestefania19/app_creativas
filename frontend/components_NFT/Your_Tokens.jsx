import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import { contractAddressRES4 } from "../../utils/constans.js";
import Marketplace from "./Marketplace.jsx"
import { WalletContext } from '../components/WalletContext.jsx';
import { contractCodeObjFrac } from "../../utils/constans.js";
import reclamarFrac from '../../utils/abi/reclamarFrac.json'
import { contractAddressReclamarFracRegistry } from "../../utils/constans.js";
import ReclamarFracRegistry from '../../utils/abi/ReclamarFracRegistry.json';
import { Spinner } from "@material-tailwind/react";

const PRIVATE_KEY_NFT = import.meta.env.VITE_PRIVATE_KEY_NFT;
const API_URL = import.meta.env.VITE_BACKEND_URL;
const PRIVATE_KEY_REGISTRY_FRAC = import.meta.env.VITE_PRIVATE_KEY_REGISTRY_FRAC

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_REGISTRY_FRAC, provider);
const contract_RES4 = new ethers.Contract(contractAddressRES4, RES4, wallet);
const wallet_registry = new ethers.Wallet(PRIVATE_KEY_REGISTRY_FRAC, provider);
const contract_Registry = new ethers.Contract(contractAddressReclamarFracRegistry, ReclamarFracRegistry, wallet_registry);

const YourTokens = () => {
    const { defaultAccount } = useContext(WalletContext);
    const [ownedAssets, setOwnedAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchOwnedAssets = async () => {
            const length = await contract_RES4.assetsCount();
            const newOwnedAssets = [];

            for (let i = 0; i < length; i++) {
                const asset = await contract_RES4.assetMap(i);
                const owner = await contract_RES4.ownerOf(i);
                const status = await contract_RES4.projectStatus(i);
                console.log(`Asset ${i} status: ${status}`);

                if (owner === defaultAccount) {
                    newOwnedAssets.push({ ...asset, status });
                }
            }

            setOwnedAssets(newOwnedAssets);
        };

        fetchOwnedAssets();
    }, [defaultAccount]);

    const deployContract = async (assetId, price) => {
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const factory = new ethers.ContractFactory(reclamarFrac, contractCodeObjFrac, signer);
        const contract_frac = await factory.deploy(contractAddressRES4, assetId);
        await contract_frac.deployed();
        console.log(`Contract deployed at ${contract_frac.address}`);
        await contract_Registry.storeContractAddress(assetId, contract_frac.address);

        let wei = ethers.utils.parseEther(price.toString());
        const dirtoken = await contract_RES4.FCTV(assetId);
        const addrFCTV = dirtoken.fractionalToken;
        console.log("Tokenid", addrFCTV)
        const reclamo = new ethers.Contract(contract_frac.address, reclamarFrac, signer);
        const gasLimit = ethers.utils.hexlify(300000);
        const transaction = await reclamo.fund(addrFCTV, { gasLimit, value: wei });
        const receipt = await transaction.wait();
        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);

        alert(`Your funds have been successfully funded. Transaction Hash: ${receipt.transactionHash}`);
    };

    return (
        <div>
            <h2 className="flex flex-col items-center mt-32 mb-2 mr-5 h-full">Tus Tokens</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {ownedAssets.map((asset, index) => (
                    <div key={index} className="mb-4">
                        <h2 className="text-lg font-bold mb-2">NFT ID #{ethers.utils.formatUnits(asset.assetId, 0)}</h2>
                        <h3>Title: {asset.titulo}</h3>
                        <p>Price: {ethers.utils.formatUnits(asset.price, 0)}</p>
                        <p>Fractional: {ethers.utils.formatUnits(asset.NFTFractional, 0)}</p>
                        {asset.status === "End_Crowfunding_Asset" && (
                            <button
                                className="bg-[#c9398a] text-white px-3 py-1 rounded mr-2"
                                onClick={() => deployContract(asset.assetId, asset.price)}
                                disabled={isLoading}
                            >
                                {isLoading ? <Spinner /> : 'Claim Token'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default YourTokens;
