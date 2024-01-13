import React, { useState } from "react";
import { eccomerce } from "../../../src/declarations/eccomerce";

const SetItem = () => {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await eccomerce.set_item({ item, price: Number(price), description });
      if (response === "Producto registrado correctamente") {
        alert("Artículo subido correctamente");
        setItem("");
        setPrice("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error subiendo el artículo: ", error);
    }
  };

  return (
    <div>
      <input type="text" value={item} onChange={(e) => setItem(e.target.value)} placeholder="item" />
      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="price" />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="description" />
      <button onClick={handleSubmit}>Subir Artículo</button>
    </div>
  );
};

export default SetItem;
