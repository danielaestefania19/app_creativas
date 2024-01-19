import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import { contractAddressRES4 } from "../../utils/constans.js";
import FractionalNFT from "../../utils/abi/FractionalNFT.json"
import { contractAddressFracNft, contractAddressNFTFRAC } from "../../utils/constans.js";
import WalletConnect from '../components/WalletConnect.jsx'; // Importa el componente WalletConnect

const PRIVATE_KEY_NFT = import.meta.env.VITE_PRIVATE_KEY_NFT;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_NFT, provider);
const contract_RES4 = new ethers.Contract(contractAddressRES4, RES4, wallet);
const contract_FracNFT = new ethers.Contract(contractAddressNFTFRAC, FractionalNFT, wallet);

async function activos(activoId, receiver, amount) {
    const dirtoken = await contract_RES4.FCTV(activoId);
    const addrFCTV = dirtoken.fractionalToken;
    const contFCTV = new ethers.Contract(addrFCTV, FractionalNFT, wallet);

    return await signTransaction(receiver, amount, addrFCTV, contFCTV);
};

async function signTransaction(receiver, amount, addrFCTV, contFCTV) {
    const value = ethers.utils.parseEther(amount.toString());
    const transaction = await contFCTV.transfer(receiver, value);
    const receipt = await transaction.wait();

    return receipt.transactionHash;
};

const ShowdetailsTokensFrac = () => {
    const [activosState, setActivos] = useState([]);
    const receiver = "0x9d687c0991e58529cd08eF53457A05d22eAeF54B";

    useEffect(() => {
        const fetchActivos = async () => {
            const cuantosActivos = await contract_RES4.getAssetsSize();
            const reasset = [];
            for (let i = 0; i < cuantosActivos; i++) {
                const r = await contract_RES4.assetMap(i);
                const result = await contract_RES4.ownerOf(r.assetId);
                reasset.push({
                    id: ethers.utils.formatUnits(r.assetId, 0),
                    precio: ethers.utils.formatUnits(r.price, 0),
                    NFTFractional: ethers.utils.formatUnits(r.NFTFractional, 0),
                    propietario: result,
                });
            }
            setActivos(reasset);
        };

        fetchActivos();
    }, []);

    return (
        <div>
            {activosState.map((activo, index) => (
                <div key={index}>
                    <p>ID: {activo.id}</p>
                    <WalletConnect />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {[...Array(parseInt(activo.NFTFractional))].map((_, i) => (
                            <button
                                key={i}
                                style={{ width: 50, height: 50, backgroundColor: 'blue', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 5 }}
                                onClick={async () => {
                                    // Obtén el firmante de window.ethereum
                                    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
                                    const contractWithSigner = contract_FracNFT.connect(signer);

                                    // Estima el gas para la transacción
                                    const amount2 = ethers.utils.formatUnits(activo.precio, 0) / activo.NFTFractional;
                                    const value = ethers.utils.parseEther(amount2.toString());
                                    const gasEstimate = await contractWithSigner.estimateGas.transfer(activo.propietario, value);

                                    // Realiza la transacción con el límite de gas estimado
                                    const tx = await contractWithSigner.transfer(activo.propietario, value, { gasLimit: gasEstimate.toNumber() });
                                    await tx.wait();

                                    // Luego ejecuta la función activos
                                    const amount = 1;
                                    const txHash = await activos(activo.id, receiver, amount);
                                    console.log(`Transaction hash: ${txHash}`);
                                }}
                            >
                                {ethers.utils.formatUnits(activo.precio, 0) / activo.NFTFractional}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShowdetailsTokensFrac;