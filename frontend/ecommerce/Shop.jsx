import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from '../components/AuthContext.jsx';
import { DefaultSidebar } from "./Sidebar.jsx";
import { Navbar } from "./Navbar.jsx";
import Item from "./Item.jsx";
import { CartProvider, useCart } from './CartContext.jsx';
import '../styles/styles.css';
import { eccomerce } from "../../src/declarations/eccomerce/index.js";

const Shop = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { whoami, isUserAuthenticated, actor } = useContext(AuthContext);
  const {addToCart} = useCart();

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


  return (
    <div className="flex flex-col mt-4 mb-2 h-full">
      <Navbar />
      <div className="flex">
        <DefaultSidebar />
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center mr-7">
          {loading ? (
            <div>Loading...</div>
          ) : (
            items?.map(([id, item]) => (
              <Item
                id={id}
                name={item.item}
                price={item.price}
                description={item.description}
                image={item.image}
                contract_address={item.contract_address}
                key={id}
                addToCart={() => addToCart({ ...item, id })}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ShopWithCartProvider = () => (
  <CartProvider>
    <Shop />
  </CartProvider>
);

export default ShopWithCartProvider;
