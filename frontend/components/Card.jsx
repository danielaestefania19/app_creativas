import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import PaymentDetails from "./PaymentDetails";
import { Spinner } from "@material-tailwind/react";

const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const Cart = ({ cart, removeFromCart, onHideCart }) => {
  const navigate = useNavigate();
  const [externalPaymentId, setExternalPaymentId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [error, setError] = useState(null);

  const provider = new ethers.providers.JsonRpcProvider(API_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(contractAddress, Crypay, wallet);

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

  const checkIfPaymentExists = async (id) => {
    return await contract.checkIfPaymentExists(id);
  };

  const startNewPayment = async (localPrice) => {
    setIsLoading(true);
    try {
      let paymentExists = await checkIfPaymentExists(externalPaymentId);
      while (paymentExists) {
        setExternalPaymentId(prevId => prevId + 1);
        paymentExists = await checkIfPaymentExists(externalPaymentId);
      }

      const gasEstimate = await contract.estimateGas.startNewPayment(externalPaymentId, localPrice);
      const tx = await contract.startNewPayment(externalPaymentId, localPrice, { gasLimit: gasEstimate.toNumber() });
      alert(`Transaction Successful transaction details: ${tx.hash}`); // Imprime el hash de la transacción

      setPaymentStarted(true);
      setShowPaymentDetails(true);
    } catch (error) {
      setError("Something went wrong when sending your transaction: " + error.message);
    }
    setIsLoading(false);
  };

  const handleCheckout = async () => {
    try {
      // Calcula el precio total del carrito
      let totalWei = ethers.BigNumber.from(0);
      cart.forEach(item => {
        let decimalString = item.price + ".0";
        let wei = ethers.utils.parseEther(decimalString);
        totalWei = totalWei.add(wei);
      });

      // Inicia un nuevo pago con el precio total
      await startNewPayment(totalWei);
      if (paymentStarted) {
        navigate(`/pay/${externalPaymentId}`);
      }
    } catch (err) {
      setError("Error starting payment: " + err.message);
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-1/3 bg-white border-l border-gray-300 p-4 z-40">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Carrito de Compras</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={onHideCart}
        >
         Disguise
        </button>
      </div>
      {cart.length === 0 ? (
        <p>The cart is empty</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="mb-4">
              <p className="text-lg font-bold">{item.name}</p>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-blue-600">${item.price}</p>
              <div className="flex items-center">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFromCart(index)}
                >
                  Eliminar
                </button>
                <span className="mx-2">{item.quantity}</span> {/* Contador */}
              </div>
            </div>
          ))}
          <button
            className="bg-[#c9398a] text-white px-4 py-2 rounded-md mt-4"
            onClick={handleCheckout}
          
            disabled={isLoading}
            >
          {isLoading ? <Spinner /> : 'Buy'}
          </button>
        </>
      )}
      {showPaymentDetails && <PaymentDetails externalPaymentId={externalPaymentId} closeModal={() => setShowPaymentDetails(false)}/>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Cart;
