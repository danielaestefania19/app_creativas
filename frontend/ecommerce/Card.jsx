import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import Crypay from "../../utils/abi/Crypay.json";
import { contractAddress } from "../../utils/constans.js";
import PaymentDetailsCard from "../components/PaymentsDetailsCard.jsx";
import { Spinner } from "@material-tailwind/react";
import { AuthContext } from '../components/AuthContext.jsx';

const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const Cart = ({ cart, removeFromCart, onHideCart }) => {
  const navigate = useNavigate();
  const [externalPaymentIds, setExternalPaymentIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [error, setError] = useState(null);
  const { whoami, isUserAuthenticated } = useContext(AuthContext);

  const handleCheckout = async () => {
    if (!isUserAuthenticated || whoami === null) {
      alert("You must log in before purchasing.");
      console.log("You must log in before purchasing.");
      return;
    }
    setIsLoading(true);
    const payments = [];
    try {
      for (const item of cart) {
        const contract = new ethers.Contract(item.contract_address, Crypay, wallet);
        let decimalString = item.price + ".0";
        let wei = ethers.utils.parseEther(decimalString);
        let paymentCount = await contract.paymentCount();
        let externalPaymentId = parseInt(paymentCount);
        let paymentExists = await contract.checkIfPaymentExists(externalPaymentId);
        while (paymentExists) {
          externalPaymentId++;
          paymentExists = await contract.checkIfPaymentExists(externalPaymentId);
        }
        const gasEstimate = await contract.estimateGas.startNewPayment(externalPaymentId, wei);

        // Crea una nueva instancia de wallet para cada transacción
        const newWallet = new ethers.Wallet(PRIVATE_KEY, provider);

        const tx = await contract.connect(newWallet).startNewPayment(externalPaymentId, wei, { gasLimit: gasEstimate.toNumber() });
        const receipt = await tx.wait();
        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
        payments.push({ id: externalPaymentId, address: item.contract_address });
      }
      setPaymentStarted(true);
      setShowPaymentDetails(true);
      setExternalPaymentIds(payments);
    } catch (error) {
      alert("Something went wrong when sending your transaction: " + error.message);
    }
    setIsLoading(false);
  };


  return (

    <div class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div class="pointer-events-auto w-screen max-w-md">
                <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div class="flex items-start justify-between">
                      <h2 class="text-lg font-bold text-gray-900" id="slide-over-title">Shopping cart</h2>
                      <div class="ml-3 flex h-7 items-center">
                        <button type="button" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={onHideCart}
                        >
                          <span class="absolute -inset-0.5"></span>
                          <span class="sr-only">Close panel</span>
                          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {cart.length === 0 ? (
                      <p>The cart is empty</p>
                    ) : (
                      <>
                        {cart.map((item, index) => (

                          <div key={index} class="mt-8">
                            <div class="flow-root">
                              <ul role="list" class="-my-6 divide-y divide-gray-200">
                                <li class="flex py-6">
                                  <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img class="h-full w-full object-cover object-center">{item.imageUrl}</img>
                                  </div>

                                  <div class="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div class="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <a href="#">{item.name}</a>
                                        </h3>
                                        <p class="ml-4">${item.price}</p>
                                      </div>
                                      <p class="mt-1 text-sm text-gray-500">{item.description}</p>
                                    </div>
                                    <div class="flex flex-1 items-end justify-between text-sm">
                                      <p class="text-gray-500">Qty 1</p>

                                      <div class="flex">
                                        <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500" onClick={() => removeFromCart(index)} >Remove</button>
                                        <span className="mx-2">{item.quantity}</span>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div class="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>$262.00</p>
                      </div>
                      <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      <div class="mt-6">
                        <a href="#" class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700" onClick={handleCheckout}

                          disabled={isLoading}
                        >  {isLoading ? <Spinner /> : 'Buy'}
                        </a>

                      </div>
                      <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or
                          <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500">
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {showPaymentDetails && <PaymentDetailsCard externalPaymentIds={externalPaymentIds} cart={cart} closeModal={() => setShowPaymentDetails(false)} />}
                {error && <div className="error">{error}</div>}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>







  );
};

export default Cart;
