import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;

// Configuración del contrato
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);


const CompletePayment = ({ id, contractAddress }) => {
    const [isLoading, setIsLoading] = useState(false);
    const contract = new ethers.Contract(contractAddress, Crypay, wallet);

    const completeHandler = async () => {
        if (!id) {
            return;
        }

        setIsLoading(true);
        try {
            const tx = await contract.complete(parseInt(id));
            await tx.wait();
            alert(`Payment completed successfully. Details of the transaction: ${tx.hash}`);
        } catch (error) {
            alert('Error completing payment:' + error.message);
        }
        setIsLoading(false);
    }

    return (
        <div className="CompletePayment" style={{ position: 'fixed', bottom: '50px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
                style={{ background: "#000000", color: "#FFFFFF" }}
                onClick={completeHandler}
                disabled={isLoading}>
                {isLoading ? 'Completing Transaction' : 'Shipment received'}
            </Button>
        </div>
    )
}

export default CompletePayment;
