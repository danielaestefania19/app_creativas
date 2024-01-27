import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import FractionalNFT from "../../utils/abi/FractionalNFT.json"
import { contractAddressRES4 } from "../../utils/constans.js";
import { WalletContext } from '../components/WalletContext.jsx';
import { contractAddressReclamarFracRegistry } from "../../utils/constans.js";
import ReclamarFracRegistry from '../../utils/abi/ReclamarFracRegistry.json'
import reclamarFrac from '../../utils/abi/reclamarFrac.json'
// Asegúrate de ajustar la ruta de importación
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
                    newInvestedAssets.push({ ...asset, status, outcome, owner });
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
        console.log("Direccion del Token a reclamar:", addrFCTV)
        const contFCTV = new ethers.Contract(addrFCTV, FractionalNFT, wallet);
        // Obtiene el balance del usuario
        const balance = await contFCTV.balanceOf(defaultAccount);
        console.log(`El usuario tiene ${ethers.utils.formatUnits(balance)} tokens.`);
        const spender = await contract_Registry.getContractAddress(activoId);
        console.log(`La dirección del contrato para el assetId ${activoId} es ${spender}`);

        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contractWithSigner = contFCTV.connect(signer);
        const gasLimit = ethers.utils.hexlify(200000);
        const transaction = await contractWithSigner.approve(spender, balance, { gasLimit });
        const receipt = await transaction.wait();
        console.log(`Transaction successful with hash: ${receipt.transactionHash}`)

        return await canjeartoken(activoId);
    };

    const canjeartoken = async (activoId) => {
        // Obtén la dirección del token fraccional
        const dirtoken = await contract_RES4.FCTV(activoId);
        const addrFCTV = dirtoken.fractionalToken;
        console.log("Direccion del Token a reclamar:", addrFCTV);

        // Crea una nueva instancia del contrato del token fraccional
        const contFCTV = new ethers.Contract(addrFCTV, FractionalNFT, wallet);

        // Obtiene el balance del usuario
        const balance = await contFCTV.balanceOf(defaultAccount);
        console.log(`El usuario tiene ${balance} tokens.`);

        // Obtiene la dirección del contrato de reclamaciones
        const contractAddress = await contract_Registry.getContractAddress(activoId);
        console.log(`La dirección del contrato para el assetId ${activoId} es ${contractAddress}`);

        // Obtén el signer a partir del proveedor de Ethereum
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

        // Crea una nueva instancia del contrato de reclamaciones
        const contract = new ethers.Contract(contractAddress, reclamarFrac, signer);



        // Escucha el evento Claimed
        contract.on("Claimed", (reclamante, cantidad, event) => {
            console.log(`Evento Claimed emitido. Reclamante: ${reclamante}, Cantidad: ${cantidad.toString()}`);
            console.log(`Información del evento: ${event}`);
        });



        const gasLimit = ethers.utils.hexlify(200000);
        // Llama a la función claim del contrato
        const tx = await contract.claim(addrFCTV, balance, { gasLimit });

        // Espera a que la transacción sea minada
        const receipt = await tx.wait();

        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);

        // Imprimir todos los eventos
        if (receipt.events) {
            receipt.events.forEach((event) => {
                console.log(`Nombre del evento: ${event.event}`);
                console.log('Argumentos del evento:');
                for (let arg in event.args) {
                    if (ethers.BigNumber.isBigNumber(event.args[arg])) {
                        console.log(`${arg}: ${event.args[arg].toString()}`);
                    } else {
                        console.log(`${arg}: ${event.args[arg]}`);
                    }
                }
            });

        }
    }




    return (
        <div>
            <h2 className="flex flex-col items-center mt-32 mb-2 mr-5 h-full">Tus inversiones</h2>
            <div div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                <div className="h-[300px] relative bg-cover bg-center w-full flex flex-col justify-between rounded-lg overflow-hidden shadow-md bg-white p-4 col-span-1">
            {investedAssets.map((asset, index) => (
                <div key={index}>
                    <h2>NFT ID #{ethers.utils.formatUnits(asset.assetId, 0)}</h2>
                    <h3>{asset.titulo}</h3>
                    <p>{asset.small_description}</p>
                    <p>Estado del proyecto: {asset.status}</p>
                    <p>Resultado de la financiación: {asset.outcome}</p>
                    {asset.outcome === "Funding_Failed" && (
                        <button onClick={() => handleRefund(asset.assetId)}>
                            Rembolsar inversión
                        </button>
                    )}
                    {asset.status === "End_Crowfunding_Asset" && (
                        <button onClick={() => approvetoken(asset.assetId)}>Canjear tokenss</button>
                    )}
                </div>
               

            ))}
            </div>
             </div>
             
        </div>
    );
};

export default YourInvest;
