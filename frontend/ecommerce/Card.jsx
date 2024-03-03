import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import PaymentDetailsCard from "./PaymentsDetailsCard.jsx";
import { Spinner } from "@material-tailwind/react";
import { AuthContext } from '../components/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { useCart } from "./CartContext.jsx";


const Cart = ({ cart, removeFromCart, onHideCart }) => {
  const navigate = useNavigate();
  const [externalPaymentIds, setExternalPaymentIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [error, setError] = useState(null);
  const { whoami, isUserAuthenticated, actor } = useContext(AuthContext);
  const [userCarts, setUserCarts] = useState(null);
  const [imageUrls, setImageUrls] = useState(null);


  const { totalPrice } = useCart();

  console.log(totalPrice)

  const [isCartLoaded, setIsCartLoaded] = useState(false);

  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        const userCart = await actor.get_user_cart();
        console.log(userCart)
        setUserCarts(userCart.Ok); // Accede a la propiedad Ok aquí
        setIsCartLoaded(true); // Indica que userCart ha sido cargado
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserCart();
  }, [actor]);

  

  useEffect(() => {
    const fetchImages = async () => {
      if (isCartLoaded && userCarts && userCarts.card) {
        try {
          const imageUrls = [];
          for (const item of userCarts.card) {
            const imageHash = item.item.image;
            const url = `https://green-capable-vole-518.mypinata.cloud/ipfs/${imageHash}`;
            imageUrls.push(url);
          }
          setImageUrls(imageUrls);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchImages();
  }, [userCarts, isCartLoaded]);


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
                    {userCarts && userCarts.card.length === 0 ? (
                      <p>The cart is empty</p>
                    ) : (
                      <>
                        {userCarts && userCarts.card.map((item, index) => (
                          <div key={index} class="mt-8">
                            <div class="flow-root">
                              <ul role="list" class="-my-6 divide-y divide-gray-200">
                                <li class="flex py-6">
                                  <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    {imageUrls && imageUrls[index] && <img src={imageUrls[index]} class="h-full w-full object-cover object-center"></img>}
                                  </div>

                                  <div class="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div class="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <a href="#">{item.item.name}</a>
                                        </h3>
                                        <p class="ml-4">${item.item.price && Number(item.item.price)}</p>

                                      </div>
                                      <p class="mt-1 text-sm text-gray-500">{item.item.description}</p>
                                    </div>
                                    <div class="flex flex-1 items-end justify-between text-sm">
                                      <p class="text-gray-500">Qty {item.amount && Number(item.amount)}</p>

                                      <div class="flex">
                                        <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500" onClick={() => removeFromCart(item.item_id)} >Remove</button>

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
                        <p>Total</p>
                        <p>${totalPrice && Number(totalPrice.Ok)}</p>
                      </div>
                      <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      <div class="mt-6">
                        <Link to="/other/checkout">
                          <a href="#" class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700" 

                            disabled={isLoading}
                          >  {isLoading ? <Spinner /> : 'Buy'}
                          </a>
                        </Link>

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

                {showPaymentDetails && <PaymentDetailsCard externalPaymentIds={externalPaymentIds} closeModal={() => setShowPaymentDetails(false)} />}
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




