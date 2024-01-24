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
    const [projectStartDate, setProjectStartDate] = useState('');
    const [projectEndDate, setProjectEndDate] = useState('');
    const [NFTFractional, setNFTFractional] = useState("");
    const [paymentGuaranteeClauses, setPaymentGuaranteeClauses] = useState("");
    const [businessPlanHash, setBusinessPlanHash] = useState("");
    const [tokenHash, setTokenHash] = useState("");
    const [investmentObjective, setInvestmentObjective] = useState("");
    const [localInvestmentObjective, setLocalInvestmentObjective] = useState(ethers.utils.parseEther("0.0"));
    const [end_crowfunding, setEnd_Crowfunding] = useState("");
    const [to, setTo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    const getAssetsCount = async () => {
        const assetsCount = await contract.assetsCount();
        console.log('El AssetId es: ', assetsCount.toString());
    };

    const handleDateChange = (e, setDate) => {
        const inputDate = e.target.value;
        // Si el valor de entrada está vacío, no hagas nada
        if (!inputDate) {
            return;
        }
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/; // Patrón para verificar el formato DD/MM/AAAA
    
        // Verifica si la fecha ingresada cumple con el formato DD/MM/AAAA
        if (datePattern.test(inputDate)) {
            const dateParts = inputDate.split("/");
            const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); // Crea un objeto Date en el formato MM/DD/AAAA
            const unixTime = Math.floor(dateObject.getTime() / 1000); // Convierte la fecha a tiempo Unix
    
            setDate(unixTime); // Actualiza el estado con el tiempo Unix
        } else {
            console.log('La fecha ingresada no cumple con el formato DD/MM/AAAA');
        }
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

            let investmentObjectiveDecimalString = parseInt(investmentObjective).toString(); // Convierte el objetivo de inversión a un número entero
            let investmentObjectiveWei = ethers.utils.parseEther(investmentObjectiveDecimalString);
            let localInvestmentObjectiveEther = ethers.utils.formatEther(investmentObjectiveWei); // Convierte el wei de vuelta a ether
            setLocalInvestmentObjective(localInvestmentObjectiveEther); // Actualiza el estado con el valor de ether
            console.log(`El objetivo de inversión en ether es: ${localInvestmentObjectiveEther}`); // Imprime el objetivo de inversión en ether



            const formData = new FormData();
            formData.append('file', file);
<<<<<<< HEAD
            const response = await axios.post('http://192.168.1.9:1234/uploadImage', formData, {
=======
            const response = await axios.post('http://192.168.1.8:1234/uploadImage', formData, {
>>>>>>> 45b768ab2df60354b6b8111bb49a57176503b227
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
<<<<<<< HEAD
                const pdfResponse = await axios.post('http://192.168.1.9:1234/uploadImage', pdfFormData, {
=======
                const pdfResponse = await axios.post('http://192.168.1.8:1234/uploadImage', pdfFormData, {
>>>>>>> 45b768ab2df60354b6b8111bb49a57176503b227
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (pdfResponse.status === 201) {
                    const pdfHash = pdfResponse.data['/'];
                    console.log(pdfHash);
                    setBusinessPlanHash(pdfHash);

                    // Resto del código...
                    const tx = await contract.addAsset(parseInt(localPriceEther), autor, titulo, small_description, projectStartDate, projectEndDate, parseInt(NFTFractional), paymentGuaranteeClauses, pdfHash, imageHash, parseInt(localInvestmentObjectiveEther), end_crowfunding, to, { gasLimit: 3000000 });
                    console.log(`Transaction hash: ${tx.hash}`);
                    console.log(projectStartDate, projectEndDate, end_crowfunding);
                    console.log(typeof projectStartDate); // Debería imprimir 'number'
                    console.log(typeof projectEndDate); // Debería imprimir 'number'
                    console.log(typeof end_crowfunding); // Debería imprimir 'number'

                    console.log('La dirección del contrato es: ', contractAddressRES4);


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
        <div className="flex items-center justify-center h-screen bg-[#f7e8f0] ">
            <div className="bg-white p-8 rounded-lg w-4/5 max-w-screen-lg  mt-28">
                <form>
                    <div class="grid gap-4 mb-2 md:grid-cols-2">
                        <div>
                            <label for="first_name" class="block text-sm font-medium text-gray-900 dark:text-white">Price</label>
                            <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Price" required value={price} onChange={e => setPrice(e.target.value)}></input>
                        </div>
                        <div>
                            <label for="last_name" class="block text-sm font-medium text-gray-900 dark:text-white">Autor</label>
                            <input type="text" id="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Autor" required value={autor} onChange={e => setAutor(e.target.value)}></input>
                        </div>
                        <div>
                            <label for="company" class="block text-sm font-medium text-gray-900 dark:text-white">Titulo</label>
                            <input type="text" id="company" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Titulo" required value={titulo} onChange={e => setTitulo(e.target.value)}></input>
                        </div>
                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-900 dark:text-white">Small Description</label>
                            <input type="text" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Small Description" required value={small_description} onChange={e => setSmallDescription(e.target.value)}></input>
                        </div>
                        <div>
                            <label for="projectStartDate" class="block text-sm font-medium text-gray-900 dark:text-white">Project Start Date</label>
                            <input type="text" id="projectStartDate" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Project Start Date" required value={projectStartDate} onChange={e => setProjectStartDate(e.target.value)} onBlur={e => handleDateChange(e, setProjectStartDate)}></input>
                        </div>
                        <div>
                            <label for="projectEndDate" class="block text-sm font-medium text-gray-900 dark:text-white">Project End Date</label>
                            <input type="text" id="projectEndDate" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Project End Date" required value={projectEndDate} onChange={e => setProjectEndDate(e.target.value)} onBlur={e => handleDateChange(e, setProjectEndDate)}></input>
                        </div>

                    </div>
                    <div class="mb-4">
                        <label for="email" class="block  text-sm font-medium text-gray-900 dark:text-white">NFT Fractional</label>
                        <input type="text" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="NFT Fractional" required value={NFTFractional} onChange={e => setNFTFractional(e.target.value)}></input>
                    </div>
                    <div class="mb-4">
                        <label for="password" class="block text-sm font-medium text-gray-900 dark:text-white">Payment Guarantee Clauses</label>
                        <input type="text" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Payment Guarantee Clauses" required value={paymentGuaranteeClauses} onChange={e => setPaymentGuaranteeClauses(e.target.value)}></input>
                    </div>
                    <div class="mb-4">
                        <label for="confirm_password" class="block text-sm font-medium text-gray-900 dark:text-white">Token Hash</label>
                        <input type="file" id="confirm_password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Token Hash" required onChange={e => setFile(e.target.files[0])}></input>
                    </div>
                    <div class="mb-4">
                        <label for="confirm_password" class="block  text-sm font-medium text-gray-900 dark:text-white">Business Plan Hash</label>
                        <input type="file" id="confirm_password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Token Hash" required onChange={handleFileChange}></input>
                    </div>
                    <div class="mb-4">
                        <label for="first_name" class="block text-sm font-medium text-gray-900 dark:text-white">Objetivo de Financiación</label>
                        <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Objetivo" required value={investmentObjective} onChange={e => setInvestmentObjective(e.target.value)}></input>
                    </div>
                    <div class="mb-4">
                        <label for="projectEndDate" class="block text-sm font-medium text-gray-900 dark:text-white">Fin de la Financiación</label>
                        <input type="text" id="projectEndDate" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Project End Date" required value={end_crowfunding} onChange={e => setEnd_Crowfunding(e.target.value)} onBlur={e => handleDateChange(e, setEnd_Crowfunding)}></input>
                    </div>

                    <div class="mb-4">
                        <label for="confirm_password" class="block  text-sm font-medium text-gray-900 dark:text-white">To</label>
                        <input type="text" id="confirm_password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={to} onChange={e => setTo(e.target.value)} placeholder="To"></input>
                    </div>
                    <button type="buttom" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={addAsset} disabled={isLoading}>Agregar Activo</button>
                    {error ? <p className="text-red-500 mt-4">{error}</p> : null}
                </form>
            </div>
        </div>
    );
};


export default AddAsset;
