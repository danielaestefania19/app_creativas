import React, { useEffect, useState } from "react";
import { eccomerce } from "../../src/declarations/eccomerce";
import Item from "./Item";
import Cart from "./Card.jsx";
import '../styles/styles.css';
import { FiShoppingCart } from "react-icons/fi";
import { Link } from 'react-router-dom';

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
    <div className="flex flex-col items-end mt-32 mb-2 mr-5 h-full">
      <div className="mb-4">
        <Link to="/other/createitems">
          <button className='bg-[#c9398a] rounded-md p-2 text-white' >Creativas Seller</button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          items?.map(([id, item]) => {
            return <Item id={id} name={item.item} price={item.price} description={item.description} image={item.image} key={id} addToCart={() => addToCart({ ...item, id })} />;
          })
        )}
      </div>
      {cartVisible && cart.length > 0 && <Cart cart={cart} removeFromCart={removeFromCart} onHideCart={handleToggleCart} />}
      {/*       <button
        className="fixed bottom-4 right-4 bg-[#3490dc] text-white px-4 py-2 rounded-md "
        onClick={handleToggleCart}>
        {<>
            <FiShoppingCart className="mr-2" />
            <span>
                {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
        </>}
      </button> */}
      <button className="relative bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M17.08,6H4.37l-0.71-1A2,2,0,0,0,1.56,4H1A1,1,0,0,0,1,6H2.44L4.13,11.38l-0.46,1.41A1,1,0,0,0,4.62,14H15a1,1,0,0,0,.93-.63l2.82-7A1,1,0,0,0,18.49,5H17.08ZM16.85,7l-2.49,6H5.21L4.27,7Z" />
        </svg>
        <span>Carrito</span>
        <span className="absolute top-0 right-0 inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
      </button>


    </div>
  );
}

export default Shop;
