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


const PaymentDetails = ({ user, item_id, externalPaymentId, contractAddress, closeModal }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  console.log(user)

  console.log(item_id)
  // Inicializa el contrato con la dirección correcta
  const contract = new ethers.Contract(contractAddress, Crypay, wallet);

  const fetchPaymentDetails = async () => {
    try {
      const paymentExists = await contract.checkIfPaymentExists(externalPaymentId);
      if (paymentExists) {
        const price = (await contract.getPrice(externalPaymentId));
        const status = await contract.getStatus(externalPaymentId);
        setPaymentDetails({ externalPaymentId, price: price, status });
        setShowDetails(true);
      } else {
        console.log("Payment does not exist");
      }
    } catch (error) {
      console.log("Error getting payment details:", error);
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
                <button onClick={() => {
                  setShowDetails(false);
                  closeModal();
                }}>
                  Close Modal
                </button>
                <h2>Payment Details</h2>
                <p>Payment ID: {paymentDetails.externalPaymentId}</p>
                <p>Price: {ethers.utils.formatEther(paymentDetails.price)} BFT</p>
                <p>Status: {paymentDetails.status}</p>
                {/* <WalletConnect /> */}
                <WalletPay item_id={item_id} id={paymentDetails.externalPaymentId} amount={paymentDetails.price} contractAddress={contractAddress} />
            </div>
            ) : (
              <p>Loading payment details...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
