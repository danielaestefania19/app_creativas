import React, { useEffect, useState } from "react";
import { eccomerce } from "../../src/declarations/eccomerce";
import Item from "./Item";
import Cart from "./Card.jsx";
import '../styles/styles.css';
import { FiShoppingCart } from "react-icons/fi";

const Shop = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await eccomerce.get_items();
        console.log(items);
        setItems(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };

    fetchItems();
  }, []);

  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
  
    if (existingItemIndex !== -1) {
      setCart((prevCart) =>
        prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
    }
  };
  
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart[index].quantity--;

    if (newCart[index].quantity === 0) {
      newCart.splice(index, 1);
    }

    setCart(newCart);
  };

  const handleToggleCart = () => {
    setCartVisible(!cartVisible);
  };

  return (
    <div className="h-screen w-screen grid md:grid-cols-4 gap-8 bg-[#f7e8f0] relative">
      {loading ? (
        <div>Loading...</div>
      ) : (
        items?.map(([id, item]) => {
          return <Item id={id} name={item.item} price={item.price} description={item.description} image={item.image} key={id} addToCart={() => addToCart({ ...item, id })} />;
        })
      )}
      {cartVisible && cart.length > 0 && <Cart cart={cart} removeFromCart={removeFromCart} onHideCart={handleToggleCart} />}
      <button
        className="fixed bottom-4 right-4 bg-[#3490dc] text-white px-4 py-2 rounded-md"
        onClick={handleToggleCart}
      >
        {cartVisible ? 'Ocultar Carrito' : <FiShoppingCart className="mr-2" />}
      </button>
    </div>
  );
};

export default Shop;
