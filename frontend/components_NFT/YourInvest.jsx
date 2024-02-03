import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import FractionalNFT from "../../utils/abi/FractionalNFT.json"
import { contractAddressRES4 } from "../../utils/constans.js";
import { WalletContext } from '../components/WalletContext.jsx';
import { contractAddressReclamarFracRegistry } from "../../utils/constans.js";
import ReclamarFracRegistry from '../../utils/abi/ReclamarFracRegistry.json'
import reclamarFrac from '../../utils/abi/reclamarFrac.json'
import { Spinner } from "@material-tailwind/react";

const PRIVATE_KEY_NFT = import.meta.env.VITE_PRIVATE_KEY_NFT;
const API_URL = import.meta.env.VITE_BACKEND_URL;
const PRIVATE_KEY_REGISTRY_FRAC = import.meta.env.VITE_PRIVATE_KEY_REGISTRY_FRAC
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_NFT, provider);
const contract_RES4 = new ethers.Contract(contractAddressRES4, RES4, wallet);
const wallet_registry = new ethers.Wallet(PRIVATE_KEY_REGISTRY_FRAC, provider);
const contract_Registry = new ethers.Contract(contractAddressReclamarFracRegistry, ReclamarFracRegistry, wallet_registry);

const YourInvest = () => {
    const { defaultAccount } = useContext(WalletContext);
    const [investedAssets, setInvestedAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchInvestedAssets = async () => {
            const length = await contract_RES4.assetsCount();
            const newInvestedAssets = [];
            for (let i = 0; i < length; i++) {
                const asset = await contract_RES4.assetMap(i);
                const owner = await contract_RES4.ownerOf(asset.assetId);
                const investment = await contract_RES4.investmentAmountOf(i, defaultAccount);
                if (investment > 0) {
                    const status = await contract_RES4.projectStatus(i);
                    const outcome = await contract_RES4.fundingOutcome(i);
                    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
                    const contractAddress = await contract_Registry.getContractAddress(asset.assetId);
                    const contract = new ethers.Contract(contractAddress, reclamarFrac, wallet);

                    let claimState;
                    try {
                        claimState = await contract.getClaimState();
                    } catch (error) {
                        claimState = 0;
                    }
                    newInvestedAssets.push({ ...asset, status, outcome, owner, claimState });
                }
            }
            setInvestedAssets(newInvestedAssets);
        };

        fetchInvestedAssets();
    }, [defaultAccount]);


    const handleRefund = async (assetId) => {
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contractWithSigner = contract_RES4.connect(signer);
        const gasLimit = ethers.utils.hexlify(300000);
        const transaction = await contractWithSigner.withdraw(assetId, { gasLimit });
        const receipt = await transaction.wait();
        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
    };

    const approvetoken = async (activoId) => {
        const dirtoken = await contract_RES4.FCTV(activoId);
        const addrFCTV = dirtoken.fractionalToken;
        const contFCTV = new ethers.Contract(addrFCTV, FractionalNFT, wallet);
        const balance = await contFCTV.balanceOf(defaultAccount);
        const spender = await contract_Registry.getContractAddress(activoId);

        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contractWithSigner = contFCTV.connect(signer);
        const gasLimit = ethers.utils.hexlify(200000);
        const transaction = await contractWithSigner.approve(spender, balance, { gasLimit });
        const receipt = await transaction.wait();

        return await canjeartoken(activoId);
    };

    const canjeartoken = async (activoId) => {
        const dirtoken = await contract_RES4.FCTV(activoId);
        const addrFCTV = dirtoken.fractionalToken;
        const contFCTV = new ethers.Contract(addrFCTV, FractionalNFT, wallet);
        const balance = await contFCTV.balanceOf(defaultAccount);
        const contractAddress = await contract_Registry.getContractAddress(activoId);
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contract = new ethers.Contract(contractAddress, reclamarFrac, signer);

        contract.on("Claimed", (reclamante, cantidad, event) => {
        });

        const gasLimit = ethers.utils.hexlify(200000);
        const tx = await contract.claim(addrFCTV, balance, { gasLimit });

        // Esperas a que la transacción se complete
        const receipt = await tx.wait();

        // Imprimes el hash de la transacción
        console.log(receipt.hash)

        // Muestras una alerta con el hash de la transacción
        alert(`Your funds have been successfully claimed. Check your wallet to see your funds. Transaction Hash: ${receipt.hash}`);
    }

    return (
        <div>
            <h2 className="flex flex-col items-center mt-32 mb-2 mr-5 h-full">Your investments</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {investedAssets.map((asset, index) => (
                    <div key={index} className="mb-4">
                        <h2 className="text-lg font-bold mb-2">NFT ID #{ethers.utils.formatUnits(asset.assetId, 0)}</h2>
                        <h3>{asset.titulo}</h3>
                        <p>{asset.small_description}</p>
                        <p>Project status: {asset.status}</p>
                        <p>Financing result: {asset.outcome}</p>
                        {asset.outcome === "Funding_Failed" && (
                            <button onClick={() => handleRefund(asset.assetId)}>
                                Repay investment
                            </button>
                        )}
                        {asset.status === "End_Crowfunding_Asset" && asset.claimState === 1 && (
                            <button className="bg-[#c9398a] text-white px-3 py-1 rounded mr-2" onClick={() => approvetoken(asset.assetId)}
                                disabled={isLoading}>
                                {isLoading ? <Spinner /> : 'Redeem tokens'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YourInvest;
