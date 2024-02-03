import React, { useCallback, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import FormData from 'form-data';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { eccomerce } from "../../src/declarations/eccomerce";
import { AuthContext } from './AuthContext';
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
  const [file, setFile] = useState(null);
  const [myipfsHash, setIPFSHASH] = useState('');
  const [error, setError] = useState(null); // new state for the error
  const { whoami } = useContext(AuthContext);
  const [fileMessage, setFileMessage] = useState('Sin archivos seleccionados'); // nuevo estado

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileMessage(file.name); // actualizamos el mensaje con el nombre del archivo
    } else {
      setFileMessage('Sin archivos seleccionados'); // si no hay archivo, mostramos este mensaje
    }
  }, []);


  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('Select a file before uploading an item.');
      return;
    }

    if (!item || !price || !description) {
      setError('Please fill all fields before uploading an item.');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const API_KEY = import.meta.env.VITE_PINATA_API_KEY;

    const API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    try {
      const response = await axios.post(
        url,
        formData,
        {
          maxContentLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
            'pinata_api_key': API_KEY,
            'pinata_secret_api_key': API_SECRET
          }
        }
      );
      eccomerce.set_item({ item, price, description, image: response.data.IpfsHash, owner: whoami });
      // If everything goes well, we clear the error
      setError(null);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.data);
      }

      // Here we set the error message we want to show
      setError('An error occurred while uploading the product. Please try again.');
    }
  }, [file, item, price, description, whoami]);

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
              <input type="file" class="bg-gray-50 border border-gray-500 rounded-lg w-[300px]" required onChange={handleFileChange}></input>
              <p>{fileMessage}</p> {/* mostramos el mensaje aquí */}
            </div>

            <div>
              <p>Principal: {whoami}</p>
            </div>
          </Typography>
          {/* Here we show the error message if there is one */}
          {error && (
            <div className="text-red-500">
              {error}
            </div>
          )}
          <Button onClick={handleUpload}>Upload</Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default ItemsUploader;
