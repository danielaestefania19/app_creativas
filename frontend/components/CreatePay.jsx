import React, { useState } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import Pay from "./Pay.jsx";
import '../styles/styles.css'

function PaymentForm() {
  const navigate = useNavigate();
  const [externalPaymentId, setExternalPaymentId] = useState(0);
  const [price, setPrice] = useState(0);

  const { config, error } = usePrepareContractWrite({
    address: contractAddress,
    abi: Crypay,
    functionName: "startNewPayment",
    args: [externalPaymentId, price],
  });
console.log(config);
  const { isLoading, writeAsync: startNewPayment } = useContractWrite(config);

  const handlePayment = async () => {
    if (!isLoading) {
      try {
        await startNewPayment();
        navigate('/pay');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container">
    <input
      className="input-field"
      type="number"
      value={externalPaymentId}
      onChange={e => setExternalPaymentId(e.target.value)}
      placeholder="External Payment ID"
    />
    <input
      className="input-field"
      type="number"
      value={price}
      onChange={e => setPrice(e.target.value)}
      placeholder="Price"
    />
    <button className="submit-button" onClick={handlePayment}>
      Start New Payment
    </button>
    <Routes>
      <Route path="pay" element={<Pay />} />
    </Routes>
  </div>
);
}

export default PaymentForm;
