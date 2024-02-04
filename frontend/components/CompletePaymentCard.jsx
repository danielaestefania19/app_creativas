import React, { useState } from 'react';
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;

// Configuración del contrato
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const CompletePaymentCard = ({ paymentInfo }) => {
    const [isLoading, setIsLoading] = useState(false);
  
    const completeHandler = async () => {
      setIsLoading(true);
  
      try {
        // Inicializa el contrato Crypay con la dirección del contrato del artículo
        const crypayContract = new ethers.Contract(paymentInfo.contractAddress, Crypay, wallet);
  
        const tx = await crypayContract.complete(paymentInfo.externalPaymentId);
  
        await tx.wait();
  
        alert(`Payment completed successfully. Details of the transaction: ${tx.hash}`);
      } catch (error) {
        alert('Error when completing payment: ' + error.message);
        console.log('Error when completing payment: ' + error.message)
      }
  
      setIsLoading(false);
    }

    return (
        <button 
          className="CompletePayment" 
          style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center' 
          }}
          onClick={completeHandler}
          disabled={isLoading}
        >
          {isLoading ? 'Completing transaction...' : `Completar Pago ${paymentInfo.externalPaymentId}`}
        </button>
      )
}

export default CompletePaymentCard;
