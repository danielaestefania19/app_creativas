import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import WalletConnect from './WalletConnect.jsx';
import WalletPay from './Pay';

const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, Crypay, wallet);

const PaymentDetails = ({ externalPaymentId, closeModal }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchPaymentDetails = async () => {
    try {
      const paymentExists = await contract.checkIfPaymentExists(externalPaymentId);
      if (paymentExists) {
        const price = (await contract.getPrice(externalPaymentId)).toString();
        const status = await contract.getStatus(externalPaymentId);
        setPaymentDetails({ externalPaymentId, price: price, status });
        setShowDetails(true);
      } else {
        console.log("El pago no existe");
      }
    } catch (error) {
      console.log("Error al obtener los detalles del pago:", error);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [externalPaymentId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-md z-50">
    <div className="modal">
      <div className="modal-content">
        {showDetails && paymentDetails ? (
          <div>
            <h2>Detalles del Pago</h2>
            <p>ID del Pago: {paymentDetails.externalPaymentId}</p>
            <p>Precio: {paymentDetails.price} BFT</p>
            <p>Status: {paymentDetails.status}</p>
            <WalletConnect />
            <WalletPay id={paymentDetails.externalPaymentId} amount={paymentDetails.price} />
          </div>
        ) : (
          <p>Cargando detalles del pago...</p>
        )}
        <button onClick={() => {
          setShowDetails(false);
          closeModal(); // Agrega esta función para cerrar el modal desde el componente padre
        }}>
          Cerrar Modal
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default PaymentDetails;
