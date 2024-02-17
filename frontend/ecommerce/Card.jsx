import React, { useState, useEffect,  useContext } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import PaymentDetailsCard from "../components/PaymentsDetailsCard.jsx";
import { Spinner } from "@material-tailwind/react";
import { AuthContext } from '../components/AuthContext.jsx';

const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const Cart = ({ cart, removeFromCart, onHideCart }) => {
  const navigate = useNavigate();
  const [externalPaymentIds, setExternalPaymentIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [error, setError] = useState(null);
  const { whoami, isUserAuthenticated } = useContext(AuthContext);

  const handleCheckout = async () => {
    if (!isUserAuthenticated || whoami === null) {
      alert("You must log in before purchasing.");
      console.log("You must log in before purchasing.");
      return;
    }
    setIsLoading(true);
    const payments = [];
    try {
      for (const item of cart) {
        const contract = new ethers.Contract(item.contract_address, Crypay, wallet);
        let decimalString = item.price + ".0";
        let wei = ethers.utils.parseEther(decimalString);
        let paymentCount = await contract.paymentCount();
        let externalPaymentId = parseInt(paymentCount);
        let paymentExists = await contract.checkIfPaymentExists(externalPaymentId);
        while (paymentExists) {
          externalPaymentId++;
          paymentExists = await contract.checkIfPaymentExists(externalPaymentId);
        }
        const gasEstimate = await contract.estimateGas.startNewPayment(externalPaymentId, wei);
  
        // Crea una nueva instancia de wallet para cada transacción
        const newWallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
        const tx = await contract.connect(newWallet).startNewPayment(externalPaymentId, wei, { gasLimit: gasEstimate.toNumber() });
        const receipt = await tx.wait();
        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
        payments.push({ id: externalPaymentId, address: item.contract_address });
      }
      setPaymentStarted(true);
      setShowPaymentDetails(true);
      setExternalPaymentIds(payments);
    } catch (error) {
      alert("Something went wrong when sending your transaction: " + error.message);
    }
    setIsLoading(false);
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
      {showPaymentDetails && <PaymentDetailsCard externalPaymentIds={externalPaymentIds} cart={cart} closeModal={() => setShowPaymentDetails(false)} />}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Cart;
