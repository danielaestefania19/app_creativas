import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import PaymentDetails from "../components/PaymentDetails.jsx";
import { AuthContext } from '../components/AuthContext.jsx';
import { WalletContext } from '../components/WalletContext.jsx';
import { useCart } from "./CartContext.jsx";



const Item = ({ id, name, price, description, image, contract_address }) => {
  const navigate = useNavigate();
  const [externalPaymentId, setExternalPaymentId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const { whoami, isUserAuthenticated } = useContext(AuthContext);
  const { addToCart } = useCart();

  let decimalString = price + ".0";
  let wei = ethers.utils.parseEther(decimalString);

  const [localPrice, setLocalPrice] = useState(wei);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [error, setError] = useState(null);



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
 
  const handleAddToCart = () => {
    const item = { id, name, price, description, image, contract_address };
    addToCart(item);
  }

  return (
    <div className="h-[300px] relative bg-cover bg-center w-full flex flex-col justify-between rounded-lg overflow-hidden shadow-md bg-white p-4 mt-2">
      <h2 className='text-center text-xl font-bold text-black'>{name}</h2>
      <img src={imageUrl} alt={name} className="w-32 h-32 rounded-full mx-auto mb-2" />
      <p className='text-center text-gray-600'>{ethers.utils.formatEther(localPrice)}BFT</p>
      <p className='mx-4 text-center'>{description}</p>
      <div className='flex justify-center mt-2 mb-4'>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Item;
