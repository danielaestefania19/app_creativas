import React, { useCallback, useState, useContext } from 'react'
import axios from 'axios'
import { eccomerce } from "../../src/declarations/eccomerce";
import { AuthContext } from './AuthContext'; // importa el contexto
import { Principal } from '@dfinity/principal';

const ItemsUploader = () => {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const { whoami } = useContext(AuthContext); // usa el contexto



const handleFileChange = useCallback(async (event) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('http://192.168.1.9:1234/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 201) {
        console.log(response.data)
        const image = response.data['/'] // Accede a la propiedad '/' del objeto
        console.log(image)
        console.log(whoami)
        eccomerce.set_item({item, price, description, image, owner: whoami});// Aquí se llama a la función set_item
        console.log(image)
    }
    
    } catch (error) {
      console.error(error)
      if (error.response) {
        console.error(error.response.data)
      }
    }
  }, [item, price, description, whoami]) // agrega whoami a las dependencias del useCallback
console.log(whoami)
  return (
    <div>
      <input type="text" value={item} onChange={e => setItem(e.target.value)} placeholder="Item" />
      <input type="number" value={price} onChange={e => setPrice(e.target.value ? Number(e.target.value) : "")} placeholder="Price" />
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <input type="file" onChange={handleFileChange} />
      <div>
        <p>Principal: {whoami}</p>
      </div>
    </div>
  )
}

export default ItemsUploader
