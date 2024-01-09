import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import WalletConnect from './WalletConnect.jsx'; // Importa el componente WalletConnect
import WalletPay from './Pay'; // Importa el componente WalletPay

const PRIVATE_KEY = "40e9c60a01bf78d942efa906b56ee28c49bbb51258e65825edee7545940a5f8e"
const PUBLIC_KEY = "0x8Af24521Ef46D6203c0633DC34ec32d558F3BEFA"
const API_URL = "https://testnet.bitfinity.network"

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
