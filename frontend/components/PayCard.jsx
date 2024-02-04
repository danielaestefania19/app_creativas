import React, { useState } from 'react';
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import CardCrypay from "../../utils/abi/CardCrypay.json"; // Importa el ABI de CardCrypay
import CompletePaymentCard from './CompletePaymentCard.jsx';
import { contractAddressCardCrypay } from "../../utils/constans.js";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const provider = new ethers.providers.JsonRpcProvider(API_URL);

const WalletPayCard = ({ paymentInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false); // Nuevo estado para rastrear si el pago se ha completado

  console.log(paymentInfo)

  const payHandler = async () => {
    setIsLoading(true);

    // Inicializa el contrato CardCrypay
    const cardCrypayContract = new ethers.Contract(contractAddressCardCrypay, CardCrypay, provider);

    // Prepara los arrays para la función batchPay
    const externalPaymentIds = paymentInfo.map(info => parseInt(info.externalPaymentId));
    console.log(externalPaymentIds)
    const prices = paymentInfo.map(info => info.price);
    console.log(prices)
    const contractAddresses = paymentInfo.map(info => info.contractAddress);
    console.log(contractAddresses)

    // Realiza el pago
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
    const cardCrypayContractWithSigner = cardCrypayContract.connect(signer);

    try {

      // Suma todos los precios
      let totalAmount = ethers.BigNumber.from(0);
      prices.forEach(price => {
        totalAmount = totalAmount.add(price);
      });

      // Ahora puedes pasar totalAmount directamente a la función batchPay
      const tx = await cardCrypayContractWithSigner.batchPay(externalPaymentIds, prices, contractAddresses, { value: totalAmount });

      await tx.wait();

      alert(`Payment made successfully. Details of the transaction: ${tx.hash}`);
      setIsPaymentComplete(true); // Actualiza el estado isPaymentComplete a true después de que se haya realizado el pago
    } catch (error) {
      alert('Error when making payment: ' + error.message);
      console.log('Error when making payment: ' + error.message)
    }

    setIsLoading(false);
  }

  return (
    <>
      <button className='bg-[#c9398a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-white'
        onClick={payHandler}
        disabled={isLoading}>
        {isLoading ? 'Making transaction...' : 'Pay'}
      </button>
      {isPaymentComplete && ( // Renderiza CompletePaymentCard solo si isPaymentComplete es true
        <div 
          className="WalletCard" 
          style={{ 
            position: 'fixed', 
            bottom: '50px', 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}
        >
          {paymentInfo.map((info, index) => (
            <CompletePaymentCard key={index} paymentInfo={info} />
          ))}
        </div>
      )}
    </>
  )

}

export default WalletPayCard;
