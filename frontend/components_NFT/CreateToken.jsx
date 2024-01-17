import React, { useState } from "react";
import { ethers } from 'ethers';
import axios from 'axios';
import RES4 from "../../utils/abi/RES4.json";
import { contractAddressRES4 } from "../../utils/constans.js";

const PRIVATE_KEY_NFT = import.meta.env.VITE_PRIVATE_KEY_NFT;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_NFT, provider);
const contract = new ethers.Contract(contractAddressRES4, RES4, wallet);

const AddAsset = () => {
    const [price, setPrice] = useState("");
    const [localPrice, setLocalPrice] = useState(ethers.utils.parseEther("0.0"));
    const [autor, setAutor] = useState("");
    const [titulo, setTitulo] = useState("");
    const [small_description, setSmallDescription] = useState("");
    const [projectStartDate, setProjectStartDate] = useState("");
    const [projectEndDate, setProjectEndDate] = useState("");
    const [NFTFractional, setNFTFractional] = useState("");
    const [paymentGuaranteeClauses, setPaymentGuaranteeClauses] = useState("");
    const [businessPlanHash, setBusinessPlanHash] = useState("");
    const [tokenHash, setTokenHash] = useState("");
    const [to, setTo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    const getAssetsCount = async () => {
        const assetsCount = await contract.assetsCount();
        console.log('El AssetId es: ', assetsCount.toString());
    };

    const addAsset = async () => {
        setIsLoading(true);
        try {
            let decimalString = parseInt(price).toString(); // Convierte el precio a un número entero
            let wei = ethers.utils.parseEther(decimalString);
            let ether = ethers.utils.formatEther(wei); // Convierte el wei de vuelta a ether
            let localPriceEther = ether; // Usa una variable local para almacenar el valor de ether
            setLocalPrice(ether); // Actualiza el estado con el valor de ether
            console.log(`El precio en ether es: ${localPriceEther}`); // Imprime el precio en ether usando la variable local


            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post('http://192.168.1.7:7000/uploadImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                const imageHash = response.data['/'];
                console.log(imageHash);
                setTokenHash(imageHash);

                const pdfFormData = new FormData();
                pdfFormData.append('file', pdfFile);
                const pdfResponse = await axios.post('http://192.168.1.7:7000/uploadPDF', pdfFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (pdfResponse.status === 201) {
                    const pdfHash = pdfResponse.data['/'];
                    console.log(pdfHash);
                    setBusinessPlanHash(pdfHash);

                    // Resto del código...
                    const tx = await contract.addAsset(parseInt(localPriceEther), autor, titulo, small_description, projectStartDate, projectEndDate, parseInt(NFTFractional), paymentGuaranteeClauses, pdfHash, imageHash, to, { gasLimit: 3000000 });
                    console.log(`Transaction hash: ${tx.hash}`);
                    console.log('Reclama tu NFT en tu cuenta en Metamask:  ');
                    console.log('La dirección del contrato es: ', contractAddressRES4);
                    console.log(localPriceEther, autor, titulo, small_description, projectStartDate, projectEndDate, parseInt(NFTFractional), paymentGuaranteeClauses, pdfHash, imageHash)

                    // Resto del código...
                    console.log(`El precio en ether es: ${localPriceEther.toString()}`); // Imprime el precio en ether usando la variable local
                    getAssetsCount();
                }
            }
        } catch (error) {
            setError("Algo salió mal al enviar tu transacción: " + error.message);
        }
        setIsLoading(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            console.error('El archivo debe ser un PDF');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f7e8f0] ">
            <div className="bg-white p-8 rounded-lg w-96 space-y-4">
                <input className="border border-black p-2 w-full" type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" />
                <input className="border border-black p-2 w-full" type="text" value={autor} onChange={e => setAutor(e.target.value)} placeholder="Autor" />
                <input className="border border-black p-2 w-full" type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Titulo" />
                <input className="border border-black p-2 w-full" type="text" value={small_description} onChange={e => setSmallDescription(e.target.value)} placeholder="Small Description" />
                <input className="border border-black p-2 w-full" type="text" value={projectStartDate} onChange={e => setProjectStartDate(e.target.value)} placeholder="Project Start Date" />
                <input className="border border-black p-2 w-full" type="text" value={projectEndDate} onChange={e => setProjectEndDate(e.target.value)} placeholder="Project End Date" />
                <input className="border border-black p-2 w-full" type="text" value={NFTFractional} onChange={e => setNFTFractional(e.target.value)} placeholder="NFT Fractional" />
                <input className="border border-black p-2 w-full" type="text" value={paymentGuaranteeClauses} onChange={e => setPaymentGuaranteeClauses(e.target.value)} placeholder="Payment Guarantee Clauses" />
                <input className="border border-black p-2 w-full" type="file" onChange={e => setFile(e.target.files[0])} placeholder="Token Hash" />
                <input className="border border-black p-2 w-full" type="file" onChange={handleFileChange} placeholder="Business Plan Hash" />
                <input className="border border-black p-2 w-full" type="text" value={to} onChange={e => setTo(e.target.value)} placeholder="To" />
                <button className="bg-blue-500 text-white p-2 rounded w-full" onClick={addAsset} disabled={isLoading}>Agregar Activo</button>
                {error ? <p className="text-red-500 mt-4">{error}</p> : null}
            </div>
        </div>
    );
};


export default AddAsset;
