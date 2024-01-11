import React, { useEffect, useState } from "react";
import { eccomerce } from "../../src/declarations/eccomerce";
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
    <div className="grid grid-cols-3 gap-1 justify-center items-center">
      {loading ? (
        <div>Loading...</div>
      ) : (
        items?.map(([id, item]) => {
          return <Item id={id} name={item.item} price={item.price} description={item.description} key={id} />;
        })
      )}
    </div>
  );
};

export default Shop;
