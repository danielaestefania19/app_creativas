// CompletePayment.js
import React from 'react';
import { Button } from '@material-ui/core';
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;

// Configuración del contrato
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, Crypay, wallet);

const CompletePayment = ({ id }) => {
    const completeHandler = async () => {
        if (!id) {
            console.error('Por favor, ingresa un ID');
            return;
        }

        try {
            const tx = await contract.complete(parseInt(id));
            await tx.wait();

            console.log(`Pago completado con éxito. Detalles de la transacción: ${tx.hash}`);
        } catch (error) {
            console.error('Error al completar el pago:', error);
        }
    }

    return (
        <div className="CompletePayment" style={{ position: 'fixed', bottom: '50px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button
                style={{ background: "#000000", color: "#FFFFFF" }}
                onClick={completeHandler}>
                Envío Recibido
            </Button>
        </div>
    )
}

export default CompletePayment;
