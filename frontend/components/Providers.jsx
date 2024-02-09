import React, { useCallback, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import FormData from 'form-data';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { eccomerce } from "../../src/declarations/eccomerce";
import { AuthContext } from './AuthContext';
// import { AuthContext } from './Login.jsx';
import Crypay from "../../utils/abi/Crypay.json";
import { contractCodeObjCrypay } from "../../utils/constans.js";
import { Principal } from '@dfinity/principal';
import { WalletContext } from './WalletContext.jsx';
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

const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const ItemsUploader = () => {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [myipfsHash, setIPFSHASH] = useState('');
  const [error, setError] = useState(null); // new state for the error
  const { whoami, actor } = useContext(AuthContext); // accede al actor aquí
  const [fileMessage, setFileMessage] = useState('No file selected'); // nuevo estado
  const { defaultAccount } = useContext(WalletContext);
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);


  console.log(whoami)

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileMessage(file.name); // actualizamos el mensaje con el nombre del archivo
    } else {
      setFileMessage('No file selected'); // si no hay archivo, mostramos este mensaje
    }
  }, []);


  const handleUpload = useCallback(async () => {

    if (!whoami) {
      setError('Invalid user. Please log in again.');
      return;
    }

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
      try {

        const factory = new ethers.ContractFactory(Crypay, contractCodeObjCrypay, wallet);
        console.log(defaultAccount)
        const contract_frac = await factory.deploy(defaultAccount);
        await contract_frac.deployed();
        console.log(`Contract deployed at ${contract_frac.address}`);
        console.log(whoami)


        await actor.set_item({
          item,
          price,
          description,
          image: response.data.IpfsHash,
          contract_address: contract_frac.address,
          billing_address: defaultAccount.toString(),
          stock,
          category


        });
        // Mueve la alerta aquí
        alert('Product uploaded successfully');
      } catch (error) {
        setError('Error uploading the product' + error);
      }

    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.data);
      }
      setError('An error occurred while uploading the product. Please try again.');
    }

  }, [file, item, price, description, whoami, stock, category]);

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
              <input type="file" class="bg-gray-50 border border-gray-500 rounded-lg w-[300px]" style={{ display: 'none' }} id="fileInput" onChange={handleFileChange}></input>
              <button onClick={() => document.getElementById('fileInput').click()}>Select File</button>
              <p>{fileMessage}</p> {/* mostramos el mensaje aquí */}
            </div>
            <div className="w-[300px] mb-4">
              <label>
                Category:
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="ClothingShoesAccessories">Clothing, Shoes & Accessories</option>
                  <option value="HomeKitchen">Home & Kitchen</option>
                  <option value="BeautyPersonalCare">Beauty & Personal Care</option>
                  <option value="Books">Books</option>
                  <option value="SportsOutdoor">Sports & Outdoor</option>
                  <option value="FoodBeverages">Food & Beverages</option>
                  <option value="HomeImprovement">Home Improvement</option>
                  <option value="Baby">Baby</option>
                  <option value="PetsAccessories">Pets & Accessories</option>
                </select>

              </label>
            </div>

            <div className="w-[300px] mb-4">
              <Input value={stock} onChange={e => setStock(e.target.value ? Number(e.target.value) : 0)} label="Stock" />
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
