import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import PaymentDetails from "./PaymentDetails";

const PRIVATE_KEY = "40e9c60a01bf78d942efa906b56ee28c49bbb51258e65825edee7545940a5f8e"
const PUBLIC_KEY = "0x8Af24521Ef46D6203c0633DC34ec32d558F3BEFA"
const API_URL = "https://testnet.bitfinity.network"

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, Crypay, wallet);

const Item = ({ name, price }) => {
  const navigate = useNavigate();
  const [externalPaymentId, setExternalPaymentId] = useState(0);

  let decimalString = price + ".0";
  let wei = ethers.utils.parseEther(decimalString);

  const [localPrice, setLocalPrice] = useState(wei);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  useEffect(() => {
    const fetchPaymentCount = async () => {
      const paymentCount = await contract.paymentCount();
      setExternalPaymentId(parseInt(paymentCount));
      console.log(paymentCount)
    };

    fetchPaymentCount();
  }, []);

  const checkIfPaymentExists = async (id) => {
    return await contract.checkIfPaymentExists(id);
  };

  const startNewPayment = async () => {
    try {
      const paymentExists = await checkIfPaymentExists(externalPaymentId);
      if (paymentExists) {
        console.log("El pago ya existe.");
        return;
      }

      console.log("Iniciando un nuevo pago con los siguientes valores:");
      console.log("externalPaymentId: ", externalPaymentId);
      console.log("price: ", ethers.utils.formatEther(localPrice));

      const tx = await contract.startNewPayment(externalPaymentId, localPrice, { gasLimit: 2000000 });
      console.log("El hash de tu transacción es: ", tx.hash, "\n ¡Verifica en Infura o Etherscan para ver el estado de tu transacción!");
      console.log(localPrice)
      console.log(localPrice.toString)

      setPaymentStarted(true);
      setShowPaymentDetails(true);
    } catch (error) {
      console.log("Algo salió mal al enviar tu transacción:", error);
    }
  };

  const handleBuyClick = async () => {
    try {
      await startNewPayment();
      if (paymentStarted) {
        navigate(`/pay/${externalPaymentId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-item">
      <div className="item">
        <h3>{name}</h3>
        <div>{ethers.utils.formatEther(localPrice)} BFT (su equivalente en wei: {localPrice.toString()})</div>
        <button onClick={handleBuyClick}>Comprar {name}</button>
        {showPaymentDetails && <PaymentDetails externalPaymentId={externalPaymentId} />}
      </div>
    </div>
  );
};

export default Item;
