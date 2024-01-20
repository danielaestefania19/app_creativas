import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const Marketplace = ({ assets }) => {
  return (
    <div className='className="marketplace-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"'> 
      {assets.map((asset, index) => {
        const [imageUrl, setImageUrl] = useState(null);
        const [pdfUrl, setPdfUrl] = useState(null);
        const [showMore, setShowMore] = useState(false);

        useEffect(() => {
          const fetchImage = async () => {
            try {
              const response = await axios.get(`http://192.168.1.7:1234/fetchImage/${asset.tokenHash}`, {
                responseType: 'blob',
              });

              const url = URL.createObjectURL(response.data);
              setImageUrl(url);
            } catch (error) {
              console.error(error);
              if (error.response) {
                console.error(error.response.data);
              }
            }
          };

          const fetchPdf = async () => {
            try {
              const response = await axios.get(`http://192.168.1.7:1234/fetchImage/${asset.businessPlanHash}`, {
                responseType: 'blob',
              });

              const blob = new Blob([response.data], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              setPdfUrl(url);
            } catch (error) {
              console.error(error);
              if (error.response) {
                console.error(error.response.data);
              }
            }
          };

          fetchImage();
          fetchPdf();
        }, [asset]);

        return (
          <div key={index} className="card-container col-span-1">
            <div
              className={`relative bg-cover bg-center w-full ${showMore ? 'h-auto' : 'h-96'} flex flex-col justify-between rounded-lg overflow-hidden shadow-md bg-white p-4`}
            >
              <img className={`w-32 ${showMore ? 'h-32' : 'h-32'} object-cover mx-auto mb-2 rounded`} src={imageUrl} alt="Card image" />
              <h2 className="text-center text-xl font-bold text-black">NFT ID #{ethers.utils.formatUnits(asset.assetId, 0)}</h2>
              <p className="text-center text-gray-600">Titulo: {asset.titulo}</p>
              <p className="text-center text-gray-600">Precio: {ethers.utils.formatUnits(asset.price, 0)} BFT</p>
              <p className="mx-4 text-center">{asset.small_description}</p>
              {showMore && (
                <>
                  <p className="mt-2 text-gray-500">Autor: {asset.autor}</p>
                  <p className="mt-2 text-gray-500">Fecha de inicio del proyecto: {asset.projectStartDate}</p>
                  <p className="mt-2 text-gray-500">Fecha de finalización del proyecto: {asset.projectEndDate}</p>
                  <p className="mt-2 text-gray-500">Fracciones NFT: {ethers.utils.formatUnits(asset.NFTFractional, 0)}</p>
                  <p className="mt-2 text-gray-500">Cláusulas de garantía de pago: {asset.paymentGuaranteeClauses}</p>
                  <a href={imageUrl} className="btn btn-primary stretched-link">Ampliar</a>
                  {pdfUrl && <a href={pdfUrl} className="btn btn-primary stretched-link">Ver PDF</a>}
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {[...Array(parseInt(asset.NFTFractional))].map((_, i) => (
                      <button
                        key={i}
                        style={{ width: 50, height: 50, backgroundColor: 'blue', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 5 }}
                        onClick={() => {
                          console.log(`Botón ${i + 1} presionado`);
                        }}
                      >
                        {ethers.utils.formatUnits(asset.price, 0) / asset.NFTFractional}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button className="bg-[#c9398a] text-white px-3 py-1 rounded mt-2 mx-auto" onClick={() => setShowMore(!showMore)}>
                {showMore ? 'Ver menos' : 'Ver más'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Marketplace;
