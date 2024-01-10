// WalletPay.js
import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import CompletePayment from './CompletePayment.jsx';

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Configuración del contrato
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const contract = new ethers.Contract(contractAddress, Crypay, provider);

const WalletPay = ({ id, amount }) => {
    const [paymentId, setPaymentId] = useState(null);

    const payHandler = async () => {
        if (!id || !amount) {
            console.error('Por favor, ingresa un ID y una cantidad');
            return;
        }

        // Obtén el firmante de window.ethereum
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contractWithSigner = contract.connect(signer);

        try {
            const tx = await contractWithSigner.pay(parseInt(id), { value: amount });
            await tx.wait();

            console.log(`Pago realizado con éxito. Detalles de la transacción: ${tx.hash}`);
            setPaymentId(id); // Aquí estableces el ID del pago
        } catch (error) {
            console.error('Error al realizar el pago:', error);
        }
    }

    console.log(ethers.utils.parseEther(amount))
    console.log(id)
    console.log(amount)

    return (
        <div className="WalletCard">
            <Button
                style={{ background: "#A5CC82" }}
                onClick={payHandler}>
                Pay
            </Button>
            {paymentId && <CompletePayment id={paymentId} />} {/* Aquí se renderiza el componente CompletePayment si paymentId es verdadero */}
        </div>
    )
}

export default WalletPay;
