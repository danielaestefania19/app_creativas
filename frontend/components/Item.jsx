import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import PaymentDetails from "./PaymentDetails";

const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, Crypay, wallet);

const Item = ({ id, name, price, description }) => {
  const navigate = useNavigate();
  const [externalPaymentId, setExternalPaymentId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  let decimalString = price + ".0";
  let wei = ethers.utils.parseEther(decimalString);

  const [localPrice, setLocalPrice] = useState(wei);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentCount = async () => {
      try {
        const paymentCount = await contract.paymentCount();
        setExternalPaymentId(parseInt(paymentCount));
      } catch (error) {
        console.log("Error al obtener el conteo de pagos: " + error.message);
      }
    };

    fetchPaymentCount();
  }, []);

  const checkIfPaymentExists = async (id) => {
    return await contract.checkIfPaymentExists(id);
  };

  const startNewPayment = async () => {
    setIsLoading(true);
    try {
      let paymentExists = await checkIfPaymentExists(externalPaymentId);
      while (paymentExists) {
        setExternalPaymentId(prevId => prevId + 1);
        paymentExists = await checkIfPaymentExists(externalPaymentId);
      }

      const gasEstimate = await contract.estimateGas.startNewPayment(externalPaymentId, localPrice);
      const tx = await contract.startNewPayment(externalPaymentId, localPrice, { gasLimit: gasEstimate.toNumber() });

      setPaymentStarted(true);
      setShowPaymentDetails(true);
    } catch (error) {
      setError("Algo salió mal al enviar tu transacción: " + error.message);
    }
    setIsLoading(false);
  };

  const handleBuyClick = async () => {
    try {
      await startNewPayment();
      if (paymentStarted) {
        navigate(`/pay/${externalPaymentId}`);
      }
    } catch (err) {
      setError("Error al iniciar el pago: " + err.message);
    }
  };

  return (
    <div className="bg-[#f7e8f0] p-4 rounded-lg max-w-sm">
        <h3 className="text-xl font-bold mb-1s">{name}</h3>
        <div className="mb-3">{ethers.utils.formatEther(localPrice)} BFT </div>
        <p>{description}</p>
        <button className="bg-[#c9398a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-white" onClick={handleBuyClick} disabled={isLoading}>
          {isLoading ? 'Procesando la transacción...' : `Comprar ${name}`}
        </button>
        {showPaymentDetails && <PaymentDetails externalPaymentId={externalPaymentId} />}
        {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Item;
