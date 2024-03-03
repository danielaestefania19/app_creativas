import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { AuthContext } from '../components/AuthContext';

const CartContext = createContext();

const initialState = {
  totalPrice: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_TOTAL_PRICE":
      return {
        ...state,
        totalPrice: action.payload,
      };
    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { actor } = useContext(AuthContext);
  const [cartState, setCartState] = useState(null);

  useEffect(() => {
    const fetchTotalPrice = async () => {
      try {
        const totalPrice = await actor.get_total_price();
        dispatch({ type: "SET_TOTAL_PRICE", payload: totalPrice });
      } catch (err) {
        console.error(err);
      }
    };

    fetchTotalPrice();
  }, [actor]);

 
const addToCart = async (item) => {
  try {
    await actor.add_item_card({item: item.id, amount: 1});
    const totalPrice = await actor.get_total_price();
    dispatch({ type: "SET_TOTAL_PRICE", payload: totalPrice });
    setCartState(prevState => prevState + 1); // Actualiza `cartState`
  } catch (err) {
    console.error(err);
  }
};

const removeFromCart = async (item) => {
  try {
    await actor.remove_item_from_cart(item);
    const totalPrice = await actor.get_total_price();
    dispatch({ type: "SET_TOTAL_PRICE", payload: totalPrice });
    setCartState(prevState => prevState - 1); // Actualiza `cartState`
  } catch (err) {
    console.error(err);
  }
};
  

const clearCart = async () => {
  try {
    await actor.clear_cart();
    const totalPrice = await actor.get_total_price();
    dispatch({ type: "SET_TOTAL_PRICE", payload: totalPrice });
    setCartState(0); // Actualiza `cartState` a 0
  } catch (err) {
    console.error(err);
  }
};


  return (
    <CartContext.Provider
      value={{ totalPrice: state.totalPrice, addToCart, removeFromCart, clearCart, cartState, setCartState }}
    >
      {children}
    </CartContext.Provider>
  );
  
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
