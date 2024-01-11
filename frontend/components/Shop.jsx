import React, { useEffect, useState } from "react";
import { eccomerce } from "../../src/declarations/eccomerce/";
import Item from "./Item";
import '../styles/styles.css';

const Shop = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setCart((prevCart) => [...prevCart, item]);
  };


  return (
    <div>
    <div className="grid grid-cols-3 gap-1 justify-center items-center">
      {loading ? (
        <div>Loading...</div>
      ) : (
        items?.map(([name, price]) => {
          return <Item name={name} price={price} key={name} addToCart={addToCart} />;
        })
      )}
    </div>
    <div>
        <h2>Carrito de Compras</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>{`${item.name} - ${item.price}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Shop;
