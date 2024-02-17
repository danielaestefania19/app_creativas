import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import PaymentDetails from "../components/PaymentDetails.jsx";
import { AuthContext } from '../components/AuthContext.jsx';
import { WalletContext } from '../components/WalletContext.jsx';

const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const Item = ({ id, name, price, description, image, contract_address, addToCart }) => {
  const navigate = useNavigate();
  const [externalPaymentId, setExternalPaymentId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const { whoami, isUserAuthenticated } = useContext(AuthContext);


  console.log(id)

  const contract = new ethers.Contract(contract_address, Crypay, wallet);
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
        const url = `https://green-capable-vole-518.mypinata.cloud/ipfs/${image}`;
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
      const receipt = await tx.wait();
      console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
      setPaymentStarted(true);
      setShowPaymentDetails(true);
    } catch (error) {
      alert("Something went wrong when sending your transaction: " + error.message);
    }
    setIsLoading(false);
  };

  const handleBuyClick = async () => {
    if (!isUserAuthenticated || whoami === null) {
      setError("You must log in before purchasing.");
      console.log("You must log in before purchasing.")
      return;
    }
    try {
      await startNewPayment();
      if (paymentStarted) {
        navigate(`/pay/${externalPaymentId}`);
      }
    } catch (err) {
      setError("Error starting payment: " + err.message);
    }
  };
  return (
    <div className="h-[300px] relative bg-cover bg-center w-full flex flex-col justify-between rounded-lg overflow-hidden shadow-md bg-white p-4 mt-2">
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
          {isLoading ? 'Processing the transaction...' : 'Buy'}
        </button>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => addToCart()}
        >
         Add to cart
        </button>
      </div>
      {showPaymentDetails && <PaymentDetails user={whoami} item_id={id} externalPaymentId={externalPaymentId} contractAddress={contract_address} closeModal={() => setShowPaymentDetails(false)}/>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Item;

