import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import PaymentDetails from "./PaymentDetails";
import Spinner from '@material-tailwind/react/Spinner'; // Importa el componente Spinner

const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, Crypay, wallet);

const Item = ({ name, price, description, image, addToCart }) => {
  const navigate = useNavigate();
  const [externalPaymentId, setExternalPaymentId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [expanded, setExpanded] = useState(false);

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
        return error.message;
      }
    };

    fetchPaymentCount();
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = `https://gateway.pinata.cloud/ipfs/${image}`;
        setImageUrl(url);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImage();
  }, [image]);

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
      alert(`Transaction Exitosa detalles de la transación: ${tx.hash}`); // Imprime el hash de la transacción

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
    <div className="h-[300px] relative bg-cover bg-center w-full flex flex-col justify-between rounded-lg overflow-hidden shadow-md bg-white p-4">
      <h2 className='text-center text-xl font-bold text-black'>{name}</h2>
      <img src={imageUrl} alt={name} className="w-32 h-32 rounded-full mx-auto mb-2" />
      <p className='text-center text-gray-600'>{ethers.utils.formatEther(localPrice)}BFT</p>
      <p className='mx-4 text-center'>{description}</p>
      <div className='flex justify-center mt-2 mb-4'>
        <button
          className="bg-[#c9398a] text-white px-3 py-1 rounded mr-2"
          onClick={() => {
            handleBuyClick();
            setExpanded(!expanded);
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando la transacción...' : 'Comprar'}
        </button>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => addToCart()}
        >
          Añadir al carrito
        </button>
      </div>
      {showPaymentDetails && <PaymentDetails externalPaymentId={externalPaymentId} />}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Item;

