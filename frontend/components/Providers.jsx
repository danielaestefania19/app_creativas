import React, { useCallback, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent"
import { eccomerce } from "../../src/declarations/eccomerce";
import { AuthContext } from './AuthContext'; // import the context
import { Principal } from '@dfinity/principal';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  CardFooter,
  Typography,
  Tooltip,
  Input,
  Label
} from "@material-tailwind/react";

const ItemsUploader = () => {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // New state to store the image
  const { whoami } = useContext(AuthContext); 

  useEffect(() => {
    console.log("Hello", whoami);
  }, [whoami]); 

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('http://192.168.1.8:2020/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 201) {
        console.log(response.data)
        const image = response.data['/'] 
        console.log(image)
        setImage(image); // Store the image in the state
      }

    } catch (error) {
      console.error(error)
      if (error.response) {
        console.error(error.response.data)
      }
    }
  }, []) // Remove the dependencies of the callback

  const handleUploadProduct = useCallback(async () => {
    if (image === null) {
      alert('Please, upload an image before uploading the product.');
      return;
    }
  
    try {
      console.log(whoami)
      await eccomerce.set_item({ item, price, description, image, owner: whoami });
      alert('Product uploaded successfully');
    } catch (error) {
      console.error(error)
      alert('Error uploading the product: ' + error.message);
    }
  }, [item, price, description, image, whoami]) // Add the dependencies of the 

  console.log(whoami)
  return (
    <div className="flex flex-col items-center mt-44 mb-2 mr-5 h-full">
      <Card className="w-[600px] h-[450px] bg-[#F9FAFB]">
        <CardBody className='flex flex-col items-center space-y-4 mt-8'>
          <Typography color="blue-gray" className="font-medium" textGradient>
            <div className="w-[300px] mb-4">
              <Input value={item} onChange={e => setItem(e.target.value)} label="Item" />
            </div>
            <div className="w-[300px] mb-4">
              <Input value={price} onChange={e => setPrice(e.target.value ? Number(e.target.value) : "")} label="Price" />
            </div>
            <div className="w-[300px] mb-4">
              <Input value={description} onChange={e => setDescription(e.target.value)} label="Description" />
            </div>
            <div class="w-[100px] mb-4">
              <input type="file" class="bg-gray-50 border border-gray-500 rounded-lg w-[300px] " required onChange={handleFileChange}></input>
            </div>
            <div>
              <p>Principal: {whoami}</p>
            </div>
          </Typography>
          <Button onClick={handleUploadProduct}>Upload Product</Button> {/* New button to upload the product */}
        </CardBody>
      </Card>
    </div>
  )
}

export default ItemsUploader
