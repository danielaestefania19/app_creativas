import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';
import { eccomerce } from "../../src/declarations/eccomerce";
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import CompletePayment from './CompletePayment.jsx';
import { WalletContext } from './WalletContext.jsx';



const API_URL = import.meta.env.VITE_BACKEND_URL;
const provider = new ethers.providers.JsonRpcProvider(API_URL);


const WalletPay = ({ item_id, id, amount, contractAddress }) => {
    const [paymentId, setPaymentId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { defaultAccount } = useContext(WalletContext);
    const contract = new ethers.Contract(contractAddress, Crypay, provider);

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
            try {
                const result = await eccomerce.get_contract_address(item_id);
                if (result.Ok) {
                    const address = result.Ok;
                    console.log(address);
                } else if (result.Err) {
                    console.error('Error getting contract address: ' + result.Err);
                }
            } catch (error) {
                console.error('Error calling get_contract_address: ' + error.message);
            }
            

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
                {paymentId && <CompletePayment id={paymentId} contractAddress={contractAddress} />}
 
        </div>
    )
}

export default WalletPay;
