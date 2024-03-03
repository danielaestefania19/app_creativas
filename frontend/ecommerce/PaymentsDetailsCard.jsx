import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import WalletPayCard from '../components/PayCard';

const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const PaymentDetailsCard = ({ externalPaymentIds, cart, closeModal }) => {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [total, setTotal] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const details = await Promise.all(
          externalPaymentIds.map(async (payment) => {
            const contract = new ethers.Contract(payment.address, Crypay, wallet);
            const paymentExists = await contract.checkIfPaymentExists(payment.id);
            if (paymentExists) {
              const price = (await contract.getPrice(payment.id));
              const status = await contract.getStatus(payment.id);
              return { externalPaymentId: payment.id, price: price, status, contractAddress: payment.address }; // Incluye la dirección del contrato
            } else {
              console.log("Payment does not exist");
              return null;
            }
          })
        );
        setPaymentDetails(details.filter(detail => detail !== null));
        setShowDetails(true);
      } catch (error) {
        console.log("Error getting payment details:", error);
      }
    };
  
    fetchPaymentDetails();
  }, [externalPaymentIds]);
  
  
  useEffect(() => {
    const total = paymentDetails.reduce((sum, detail) => sum + parseFloat(ethers.utils.formatEther(detail.price)), 0);
    setTotal(total);
  }, [paymentDetails]);

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
                <h2>Total Payment Details</h2>
                <p>Total: {total} BFT</p>
                <WalletPayCard paymentInfo={paymentDetails}  />
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

export default PaymentDetailsCard;
