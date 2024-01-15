import React, { useCallback, useState } from 'react'
import axios from 'axios'
import { eccomerce } from "../../src/declarations/eccomerce";

const ItemsUploader = () => {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('http://192.168.1.9:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 201) {
        console.log(response.data)
        const image = response.data['/'] // Accede a la propiedad '/' del objeto
        console.log(image)
        eccomerce.set_item({item, price, description, image}); // Aquí se llama a la función set_item
        console.log(image)
    }
    
    } catch (error) {
      console.error(error)
      if (error.response) {
        console.error(error.response.data)
      }
    }
  }, [item, price, description])

  return (
    <div>
      <input type="text" value={item} onChange={e => setItem(e.target.value)} placeholder="Item" />
      <input type="number" value={price} onChange={e => setPrice(e.target.value ? Number(e.target.value) : "")} placeholder="Price" />
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <input type="file" onChange={handleFileChange} />
    </div>
  )
}

export default ItemsUploader
