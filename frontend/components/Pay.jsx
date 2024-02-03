import React, { useState } from 'react';
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import CompletePayment from './CompletePayment.jsx';

const API_URL = import.meta.env.VITE_BACKEND_URL;
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const contract = new ethers.Contract(contractAddress, Crypay, provider);

const WalletPay = ({ id, amount }) => {
    const [paymentId, setPaymentId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const payHandler = async () => {
        if (!id || !amount) {
            return;
        }

        setIsLoading(true);

       
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contractWithSigner = contract.connect(signer);

        try {
            const tx = await contractWithSigner.pay(parseInt(id), { value: amount });
            await tx.wait();

            alert(`Payment made successfully. Details of the transaction: ${tx.hash}`);
            setPaymentId(id); 
        } catch (error) {
            alert('Error when making payment: ' + error.message);
        }

        setIsLoading(false);
    }

    return (
        <div className="WalletCard">
            <button className='bg-[#c9398a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-white'
                onClick={payHandler}
                disabled={isLoading}>
                {isLoading ? 'Making transaction...' : 'Pay'}
                </button>
            {paymentId && <CompletePayment id={paymentId} />} 
        </div>
    )
}

export default WalletPay;
