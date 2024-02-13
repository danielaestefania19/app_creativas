import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import ShowdetailsTokensFrac from './showFracNFT';


const Marketplace = ({ assets }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
      {assets.map((asset, index) => {
        const [imageUrl, setImageUrl] = useState(null);
        const [pdfUrl, setPdfUrl] = useState(null);
        const [modalVisible, setModalVisible] = useState(false);

        const handleModalToggle = () => {
          setModalVisible(!modalVisible);
        };

        useEffect(() => {
          const fetchImage = async () => {
            try {
              const url = `https://green-capable-vole-518.mypinata.cloud/ipfs/${asset.tokenHash}`;
              setImageUrl(url);
            } catch (error) {
              console.error(error);
            }
          };
        
          const fetchPdf = async () => {
            try {
              const url = `https://green-capable-vole-518.mypinata.cloud/ipfs/${asset.businessPlanHash}`;
              setPdfUrl(url);
            } catch (error) {
              console.error(error);
            }
          };
        
          fetchImage();
          fetchPdf();
        }, [asset]);
        

        return (
          <div key={index} className="card-container col-span-1">
            <div className="h-[300px] relative bg-cover bg-center w-full flex flex-col justify-between rounded-lg overflow-hidden shadow-md bg-white p-4">
              <img className="aspect-w-16 aspect-h-9 object-cover h-20 mx-auto mb-2 rounded" src={imageUrl} alt="Card image" />
              <h2 className="text-center text-xl font-bold text-black">NFT ID #{ethers.utils.formatUnits(asset.assetId, 0)}</h2>
              <p className="text-center text-gray-600">Title: {asset.titulo}</p>
              <p className="text-center text-gray-600">Price: {ethers.utils.formatUnits(asset.price, 0)} BFT</p>
              <p className="mx-4 text-center overflow-hidden overflow-ellipsis max-h-16">{asset.small_description}</p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="bg-[#c9398a] text-white px-3 py-1 rounded mt-2 mx-auto"
                >
                  View more...
                </button>
                <div id="crypto-modal" className={`fixed inset-0 z-50 flex items-center justify-center ${modalVisible ? '' : 'hidden'}`}>
                  <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow">
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">Read more...</h3>
                        <button
                          type="button"
                          onClick={handleModalToggle}
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center"
                        >
                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="mt-2 text-gray-500">Author: {asset.autor}</p>
                        <p className="mt-2 text-gray-500">Project start date: {new Date(asset.projectStartDate * 1000).toLocaleDateString()}</p>
                        <p className="mt-2 text-gray-500">Project End Date: {new Date(asset.projectEndDate * 1000).toLocaleDateString()}</p>
                        <p className="mt-2 text-gray-500">NFT Fractions: {ethers.utils.formatUnits(asset.NFTFractional, 0)}</p>
                        <p className="mt-2 text-gray-500">Payment guarantee clauses:{asset.paymentGuaranteeClauses}</p>
                        <p className="text-center text-gray-600">Investment Objective: {ethers.utils.formatUnits(asset.investmentObjective, 0)} BFT</p>
                        <p className="text-center text-gray-600">Final day of investment: {new Date(asset.end_crowfunding * 1000).toLocaleDateString()}</p>
                        
                        <a href={imageUrl} className="btn btn-primary stretched-link">Enlarge</a>
                        {pdfUrl && <a href={pdfUrl} className="btn btn-primary stretched-link">View PDF</a>}
                        <div style={{ display: 'flex', flexDirection: 'row' }}></div>
                        <ShowdetailsTokensFrac
                          id={ethers.utils.formatUnits(asset.assetId, 0)}
                          precio={ethers.utils.formatUnits(asset.price, 0)}
                          NFTFractional={ethers.utils.formatUnits(asset.NFTFractional, 0)}
                          propietario={asset.owner}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Marketplace;
