import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import RES4 from "../../utils/abi/RES4.json";
import { contractAddressRES4 } from "../../utils/constans.js";
import FractionalNFT from "../../utils/abi/FractionalNFT.json"
import { contractAddressFracNft } from "../../utils/constans.js";

const PRIVATE_KEY_NFT = import.meta.env.VITE_PRIVATE_KEY_NFT;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY_NFT, provider);

const contract_RES4 = new ethers.Contract(contractAddressRES4, RES4, wallet);
const contract_Frac_Nft = new ethers.Contract(contractAddressFracNft, FractionalNFT, wallet);

const Balance = () => {
  const [activos, setActivos] = useState([]);

  useEffect(() => {
    const fetchActivos = async () => {
      const cuantosActivos = await contract_RES4.getAssetsSize();
      const reasset = [];
      for(let i = 0; i < cuantosActivos; i++){
        const r = await contract_RES4.assetMap(i);
        const result = await contract_RES4.ownerOf(r.assetId);
        let res = await contract_RES4.assetApprovals(r.assetId);
        if(res === 0){
          res = 'None';
        }
        const dirtoken = await contract_RES4.FCTV(r.assetId);
        const addrFCTV = dirtoken.fractionalToken;
        const contFCTV= new ethers.Contract(addrFCTV, FractionalNFT, wallet);
        const totaltoken = await contFCTV.totalSupply();

        reasset.push({
            id: r.assetId,
            precio: r.price,
            autor: r.autor,
            titulo: r.titulo,
            small_description: r.small_description,
            projectStartDate: r.projectStartDate,
            projectEndDate: r.projectEndDate,
            NFTFractional: r.NFTFractional,
            paymentGuaranteeClauses: r.paymentGuaranteeClauses,
            businessPlanHash: r.businessPlanHash,
            tokenHash: r.tokenHash,
            propietario: result,
            aprobado: res,
            dirToken: {
              tokenId: dirtoken.tokenId,
              fractionalToken: dirtoken.fractionalToken,
            },
            totalToken: totaltoken,
          });
          
      }
      setActivos(reasset);
    };

    fetchActivos();
  }, []);

  console.log(activos)

  return (
    <div>
   <p>Hi!</p>
    </div>
  );
};

export default Balance;
