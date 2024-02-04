import React, { useState } from "react";
import { ethers } from 'ethers';
import axios from 'axios';
import RES4 from "../../utils/abi/RES4.json";
import { contractAddressRES4 } from "../../utils/constans.js";
import { Spinner } from "@material-tailwind/react";

const PRIVATE_KEY_NFT = import.meta.env.VITE_PRIVATE_KEY_NFT;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_NFT, provider);
const contract = new ethers.Contract(contractAddressRES4, RES4, wallet);

const API_KEY = import.meta.env.VITE_PINATA_API_KEY;

const API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;

const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

const AddAsset = () => {
    const [price, setPrice] = useState("");
    const [localPrice, setLocalPrice] = useState(ethers.utils.parseEther("0.0"));
    const [autor, setAutor] = useState("");
    const [titulo, setTitulo] = useState("");
    const [small_description, setSmallDescription] = useState("");
    const [projectStartDateDisplay, setProjectStartDateDisplay] = useState("");
    const [projectStartDate, setProjectStartDate] = useState("");
    const [projectEndDateDisplay, setProjectEndDateDisplay] = useState("");
    const [projectEndDate, setProjectEndDate] = useState("");
    const [NFTFractional, setNFTFractional] = useState("");
    const [paymentGuaranteeClauses, setPaymentGuaranteeClauses] = useState("");
    const [businessPlanHash, setBusinessPlanHash] = useState("");
    const [tokenHash, setTokenHash] = useState("");
    const [investmentObjective, setInvestmentObjective] = useState("");
    const [localInvestmentObjective, setLocalInvestmentObjective] = useState(ethers.utils.parseEther("0.0"));
    const [endCrowfundingDisplay, setEndCrowfundingDisplay] = useState("");
    const [endCrowfunding, setEndCrowfunding] = useState("");
    const [to, setTo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    const getAssetsCount = async () => {
        const assetsCount = await contract.assetsCount();
        console.log('The AssetId is: ', assetsCount.toString());
    };

    const showAlert = async (hash) => {
        const assetsCount = await contract.assetsCount();
        const assetsCountMinusOne = assetsCount - 1;

        alert(`Token has been created successfully. Check it in your wallet. Contract Address: ${contractAddressRES4}, Token ID: ${assetsCountMinusOne.toString()}, Transaccion Hash: ${hash},`);
    };
    const handleDateChange = (e, setDate, setDateDisplay) => {
        const inputDate = e.target.value;
        setDateDisplay(inputDate); // Actualiza el valor que se muestra en el input
    };

    const handleDateBlur = (e, setDate, setDateDisplay) => {
        const inputDate = e.target.value;

        if (!inputDate) {
            return;
        }
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

        if (datePattern.test(inputDate)) {
            const dateParts = inputDate.split("/");
            const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            const unixTime = Math.floor(dateObject.getTime() / 1000);

            setDate(unixTime); // Actualiza el valor que se usa en la función
        } else {
            alert('The date entered does not comply with the DD/MM/YYYY format');
        }
    };

    const addAsset = async () => {
        if (!price || !autor || !titulo || !small_description || !projectStartDate || !projectEndDate || !NFTFractional || !paymentGuaranteeClauses || !endCrowfunding || !to) {
            setError("Please fill out all fields.");
            return;
        }
    
        // Verifica que los archivos hayan sido subidos
        if (!file || !pdfFile) {
            setError("Please upload both files.");
            return;
        }
    
        setIsLoading(true);
        try {
            let decimalString = parseInt(price).toString();
            let wei = ethers.utils.parseEther(decimalString);
            let ether = ethers.utils.formatEther(wei);
            let localPriceEther = ether;
            setLocalPrice(ether);
            console.log(`The price in ether is: ${localPriceEther}`);

            let investmentObjectiveDecimalString = parseInt(investmentObjective).toString();
            let investmentObjectiveWei = ethers.utils.parseEther(investmentObjectiveDecimalString);
            let localInvestmentObjectiveEther = ethers.utils.formatEther(investmentObjectiveWei);
            setLocalInvestmentObjective(localInvestmentObjectiveEther);
            console.log(`The investment objective in Ethereum is: ${localInvestmentObjectiveEther}`);




            // Sube la imagen a Pinata
            const imageFormData = new FormData();
            imageFormData.append('file', file);
            const imageResponse = await axios.post(url, imageFormData, {
                maxContentLength: 'Infinity',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${imageFormData._boundary}`,
                    'pinata_api_key': API_KEY,
                    'pinata_secret_api_key': API_SECRET
                }
            });
            const imageHash = imageResponse.data.IpfsHash;
            setTokenHash(imageHash);

            // Sube el PDF a Pinata
            const pdfFormData = new FormData();
            pdfFormData.append('file', pdfFile);
            const pdfResponse = await axios.post(url, pdfFormData, {
                maxContentLength: 'Infinity',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${pdfFormData._boundary}`,
                    'pinata_api_key': API_KEY,
                    'pinata_secret_api_key': API_SECRET
                }
            });
            const pdfHash = pdfResponse.data.IpfsHash;
            setBusinessPlanHash(pdfHash);




            // Luego, en tu función addAsset:
            const tx = await contract.addAsset(parseInt(localPriceEther), autor, titulo, small_description, projectStartDate, projectEndDate, parseInt(NFTFractional), paymentGuaranteeClauses, pdfHash, imageHash, parseInt(localInvestmentObjectiveEther), endCrowfunding, to, { gasLimit: 3000000 });

            // Espera a que la transacción se complete
            await tx.wait();
            console.log(tx.hash)

            // Muestra la alerta
            showAlert(tx.hash);;


            // Resto del código...
            getAssetsCount();


        } catch (error) {
            setError("Something went wrong when sending your transaction: " + error.message);
        }
        setIsLoading(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            setError('The file must be a PDF');
        }
    };



    return (
        <div className="flex items-center justify-center h-screen bg-[#f5f1f3] ">
            <div className="bg-white p-8 rounded-lg w-4/5 max-w-screen-lg  mt-28">
                <form>
                    <div class="grid gap-4 mb-2 md:grid-cols-2">
                        <div>
                            <label for="first_name" class="block text-sm font-medium text-gray-900 dark:text-white">Price</label>
                            <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Price" required value={price} onChange={e => setPrice(e.target.value)}></input>
                        </div>
                        <div>
                            <label for="last_name" class="block text-sm font-medium text-gray-900 dark:text-white">Author</label>
                            <input type="text" id="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Author" required value={autor} onChange={e => setAutor(e.target.value)}></input>
                        </div>
                        <div>
                            <label for="company" class="block text-sm font-medium text-gray-900 dark:text-white">Title of</label>
                            <input type="text" id="company" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Title of" required value={titulo} onChange={e => setTitulo(e.target.value)}></input>
                        </div>
                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-900 dark:text-white">Small Description</label>
                            <input type="text" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Small Description" required value={small_description} onChange={e => setSmallDescription(e.target.value)}></input>
                        </div>
                        <div>
                            <label for="projectStartDate" class="block text-sm font-medium text-gray-900 dark:text-white">Project Start Date</label>

                            <input type="text" id="projectStartDate" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Project Start Date" required value={projectStartDateDisplay} onChange={e => handleDateChange(e, setProjectStartDate, setProjectStartDateDisplay)} onBlur={e => handleDateBlur(e, setProjectStartDate, setProjectStartDateDisplay)}></input>
                        </div>
                        <div>
                            <label for="projectEndDate" class="block text-sm font-medium text-gray-900 dark:text-white">Project End Date</label>
                            <input type="text" id="projectEndDate" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Project End Date" required value={projectEndDateDisplay} onChange={e => handleDateChange(e, setProjectEndDate, setProjectEndDateDisplay)} onBlur={e => handleDateBlur(e, setProjectEndDate, setProjectEndDateDisplay)}></input>
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
                        <label for="tokenHash" class="block text-sm font-medium text-gray-900 dark:text-white">Token Hash</label>
                        <div class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <input type="file" id="tokenHash" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
                            <button onClick={() => document.getElementById('tokenHash').click()}>Select File</button>
                            <p>{file ? file.name : 'No file selected'}</p>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="businessPlanHash" class="block text-sm font-medium text-gray-900 dark:text-white">Business Plan Hash</label>
                        <div class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <input type="file" id="businessPlanHash" style={{ display: 'none' }} onChange={handleFileChange} />
                            <button onClick={() => document.getElementById('businessPlanHash').click()}>Select File</button>
                            <p>{pdfFile ? pdfFile.name : 'No file selected'}</p>
                        </div>
                    </div>


                    <div class="mb-4">
                        <label for="first_name" class="block text-sm font-medium text-gray-900 dark:text-white">Funding Objective</label>
                        <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Funding Objective" required value={investmentObjective} onChange={e => setInvestmentObjective(e.target.value)}></input>
                    </div>
                    <div class="mb-4">
                        <label for="end_crowfunding" class="block text-sm font-medium text-gray-900 dark:text-white">End of Funding</label>
                        <input type="text" id="end_crowfunding" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="End of Funding" required value={endCrowfundingDisplay} onChange={e => handleDateChange(e, setEndCrowfunding, setEndCrowfundingDisplay)} onBlur={e => handleDateBlur(e, setEndCrowfunding, setEndCrowfundingDisplay)}></input>
                    </div>
                    <div clas="mb-4">
                        <label for="confirm_password" class="block  text-sm font-medium text-gray-900 dark:text-white">Owner's account for the NFT</label>
                        <input type="text" id="confirm_password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={to} onChange={e => setTo(e.target.value)} placeholder="Owner"></input>
                    </div>
                    <button type="buttom" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={addAsset} disabled={isLoading}>
                        {isLoading ? <Spinner /> : 'Add Asset'}</button>
                    {error ? <p className="text-red-500 mt-4">{error}</p> : null}
                </form>
            </div>
        </div>
    );
};


export default AddAsset;
