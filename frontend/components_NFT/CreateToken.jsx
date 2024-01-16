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
            let decimalString = price + ".0";
            let wei = ethers.utils.parseEther(decimalString);
            setLocalPrice(wei);

            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post('http://192.168.1.9:5000/uploadImage', formData, {
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
                const pdfResponse = await axios.post('http://192.168.1.9:5000/uploadPDF', pdfFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (pdfResponse.status === 201) {
                    const pdfHash = pdfResponse.data['/'];
                    console.log(pdfHash);
                    setBusinessPlanHash(pdfHash);

                    const tx = await contract.addAsset(localPrice, autor, titulo, small_description, projectStartDate, projectEndDate, parseInt(NFTFractional), paymentGuaranteeClauses, pdfHash, imageHash, to, { gasLimit: 3000000 });
                    console.log(`Transaction hash: ${tx.hash}`);
                    console.log('Reclama tu NFT en tu cuenta en Metamask:  ');
                    console.log('La dirección del contrato es: ', contractAddressRES4);
                    console.log(localPrice, autor, titulo, small_description, projectStartDate, projectEndDate, parseInt(NFTFractional), paymentGuaranteeClauses, pdfHash, imageHash)
                    console.log(pdfHash, imageHash)
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
        <div>
            <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" />
            <input type="text" value={autor} onChange={e => setAutor(e.target.value)} placeholder="Autor" />
            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Titulo" />
            <input type="text" value={small_description} onChange={e => setSmallDescription(e.target.value)} placeholder="Small Description" />
            <input type="text" value={projectStartDate} onChange={e => setProjectStartDate(e.target.value)} placeholder="Project Start Date" />
            <input type="text" value={projectEndDate} onChange={e => setProjectEndDate(e.target.value)} placeholder="Project End Date" />
            <input type="text" value={NFTFractional} onChange={e => setNFTFractional(e.target.value)} placeholder="NFT Fractional" />
            <input type="text" value={paymentGuaranteeClauses} onChange={e => setPaymentGuaranteeClauses(e.target.value)} placeholder="Payment Guarantee Clauses" />
            <input type="file" onChange={e => setFile(e.target.files[0])} placeholder="Token Hash" />
            <input type="file" onChange={handleFileChange} placeholder="Business Plan Hash" />
            <input type="text" value={to} onChange={e => setTo(e.target.value)} placeholder="To" />
            <button onClick={addAsset} disabled={isLoading}>Agregar Activo</button>
            {error ? <p>{error}</p> : null}
        </div>
    );
};


export default AddAsset;
