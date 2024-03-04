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

    console.log("Holaa completemos el pago", paymentInfo)
  
    const completeHandler = async () => {
      setIsLoading(true);
  
      try {
        // Inicializa el contrato Crypay con la dirección del contrato del artículo
        const crypayContract = new ethers.Contract(paymentInfo.contractAddress, Crypay, wallet);

        console.log("PaymentsId:", paymentInfo.externalPaymentId)
        const gasLimit = ethers.utils.hexlify(300000);

        const tx = await crypayContract.complete(paymentInfo.externalPaymentId, { gasLimit });
  
        await tx.wait();
  
        alert(`Payment completed successfully. Details of the transaction: ${tx.hash}`);
      } catch (error) {
        alert('Error when completing payment: ' + error.message);
        console.log('Error when completing payment: ' + error.message)
      }
  
      setIsLoading(false);
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center ">
      <button 
        className="bg-black text-white w-48 rounded-md font-medium my-1.5 mx-auto py-3 mt-56 flex items-center justify-center z-10"  
        onClick={completeHandler}
        disabled={isLoading}
      >
        {isLoading ? 'Completing transaction...' : `Completar Pago`}
      </button>
      </div>

    )
    
}

export default CompletePaymentCard;