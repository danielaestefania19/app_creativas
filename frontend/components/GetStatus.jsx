import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom'
import { useContractRead } from 'wagmi';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";

const PaymentStatus = () => {
  const navigate = useNavigate()
  const [externalPaymentId, setExternalPaymentId] = useState(0);
  const [status, setStatus] = useState(0);

  const { data, error } = useContractRead({
    address: contractAddress,
    abi: Crypay,
    functionName: "getStatus",
    args: [externalPaymentId],
    watch: true,
  });

  console.log("data", data)

  const handleCheckStatus = () => {
    if (data) {
      setStatus(data);
      alert(`El estado del pago es: ${data}`);
    } else if (error) {
      alert(`Hubo un error: ${error.message}`);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={externalPaymentId}
        onChange={e => setExternalPaymentId(e.target.value)}
        placeholder="External Payment ID"
      />
      <button onClick={handleCheckStatus}>
        Check Payment Status:
      </button>
      {status && <p>Estado del pago: {status}</p>}
      <button onClick={() => navigate('/')}>Ir a Home</button>
    </div>
  );
};

export default PaymentStatus;
