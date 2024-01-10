import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import WalletConnect from './WalletConnect.jsx'; // Importa el componente WalletConnect
import WalletPay from './Pay'; // Importa el componente WalletPay


const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const API_URL = import.meta.env.VITE_BACKEND_URL;


const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, Crypay, wallet);

const PaymentDetails = ({ externalPaymentId }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchPaymentDetails = async () => {
    try {
      const paymentExists = await contract.checkIfPaymentExists(externalPaymentId);
      if (paymentExists) {
        const price = (await contract.getPrice(externalPaymentId)).toString();
        const status = await contract.getStatus(externalPaymentId);
        console.log(price)
        console.log(ethers.utils.parseEther(price))
        setPaymentDetails({ externalPaymentId, price: price, status });
        setShowDetails(true);
      } else {
        console.log("El pago no existe");
      }
    } catch (error) {
      console.log("Error al obtener los detalles del pago:", error);
    }
  };

console.log(externalPaymentId)
  useEffect(() => {
    fetchPaymentDetails();
  }, [externalPaymentId]);

  return (
    <div>
      {showDetails && paymentDetails ? (
        <div>
          <h2>Detalles del Pago</h2>
          <p>ID del Pago: {paymentDetails.externalPaymentId}</p>
          <p>Precio: {paymentDetails.price} BFT</p>
          <p>Status: {paymentDetails.status}</p>
          <WalletConnect /> {/* Muestra el botón de conexión a Metamask */}
          <WalletPay id={paymentDetails.externalPaymentId} amount={paymentDetails.price} /> {/* Muestra el botón de pago */}
        </div>
      ) : (
        <p>Cargando detalles del pago...</p>
      )}
    </div>
  );
};

export default PaymentDetails;
