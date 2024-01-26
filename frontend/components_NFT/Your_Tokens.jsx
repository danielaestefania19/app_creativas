import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import { contractAddressRES4 } from "../../utils/constans.js";
import Marketplace from "./Marketplace.jsx"
import { WalletContext } from '../components/WalletContext.jsx'; // Asegúrate de ajustar la ruta de importación
import { contractCodeObjFrac } from "../../utils/constans.js";
import reclamarFrac from '../../utils/abi/reclamarFrac.json'
import { contractAddressReclamarFracRegistry } from "../../utils/constans.js";
import ReclamarFracRegistry from '../../utils/abi/ReclamarFracRegistry.json'

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
    useEffect(() => {
        const fetchOwnedAssets = async () => {
            const length = await contract_RES4.assetsCount();
            const newOwnedAssets = [];
            for (let i = 0; i < length; i++) {
                const asset = await contract_RES4.assetMap(i);
                const owner = await contract_RES4.ownerOf(i);
                const status = await contract_RES4.projectStatus(i);
                console.log(`Asset ${i} status: ${status}`); // Imprime el estado del activo
    
                if (owner === defaultAccount) {
                    // Si el usuario es el propietario de este activo, añádelo a newOwnedAssets
                    // Incluye el estado del proyecto en el objeto del activo
                    newOwnedAssets.push({...asset, status});
                }
            }
            setOwnedAssets(newOwnedAssets);
        };
    
        fetchOwnedAssets();
    }, [defaultAccount]); // Dependencia en defaultAccount para que se vuelva a ejecutar si cambia
    

    const deployContract = async (assetId, price) => {
        console.log("Assetid en your tokens", assetId)
        console.log("Assetid en your tokens ethers,", ethers.utils.formatUnits(assetId, 0))
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const factory = new ethers.ContractFactory(reclamarFrac, contractCodeObjFrac, signer);
        const contract_frac = await factory.deploy(contractAddressRES4, assetId);
        await contract_frac.deployed();
        console.log(`Contract deployed at ${contract_frac.address}`);
          // Almacena la dirección del contrato desplegado en ReclamarFracRegistry
        await contract_Registry.storeContractAddress(assetId, contract_frac.address);

    
        let wei = ethers.utils.parseEther(price.toString());
        const dirtoken = await contract_RES4.FCTV(assetId);
        console.log(dirtoken)
        const addrFCTV = dirtoken.fractionalToken;
        const reclamo = new ethers.Contract(contract_frac.address, reclamarFrac, signer); // Aquí se usa contract_frac.address y signer
        
        const gasLimit = ethers.utils.hexlify(300000);
        const transaction = await reclamo.fund(addrFCTV, { gasLimit, value: wei });
        const receipt = await transaction.wait();
        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
    };
    
    
    return (
        <div>
            <h2>Tus Tokens</h2>
            {ownedAssets.map((asset, index) => (
                <div key={index}>
                    <h2>NFT ID #{ethers.utils.formatUnits(asset.assetId, 0)}</h2>
                    <h3>Title {asset.titulo}</h3>
                    <p>Small Description{asset.small_description}</p>
                    <p>Price{ethers.utils.formatUnits(asset.price, 0)}</p>
                    <p>Fractional{ethers.utils.formatUnits(asset.NFTFractional, 0)}</p>
                    {asset.status === "End_Crowfunding_Asset" && (
                        <button onClick={() => deployContract(asset.assetId, asset.price)}>Reclamar Token</button>
                    )}
                </div>
            ))}
        </div>
    );
    
    
}

export default YourTokens;