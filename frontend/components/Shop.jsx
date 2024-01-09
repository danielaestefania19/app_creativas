import React, { useEffect, useState } from "react";
 import { eccomerce } from "../../src/declarations/eccomerce/";// Asegúrate de que la ruta del archivo sea correcta
import Item from "./Item";
import '../styles/styles.css';

const Shop = () => {
  const [items, setItems] = useState([]);
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

  return (
    <div className="item-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        items?.map(([name, price]) => {
          return <Item name={name} price={price} key={name} />;
        })
      )}
    </div>
  );
};

export default Shop;
