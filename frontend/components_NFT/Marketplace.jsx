import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const Marketplace = ({ assets }) => {
    return (
        <div>
            {assets.map((asset, index) => {
                const [imageUrl, setImageUrl] = useState(null);
                const [showMore, setShowMore] = useState(false);

                useEffect(() => {
                    const fetchImage = async () => {
                        try {
                            const response = await axios.get(`http://192.168.1.9:5000/fetchImage/${asset.tokenHash}`, {
                                responseType: 'blob'
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
                    fetchImage();
                }, [asset]);

                return (
                    <div key={index} className="col-lg-4  mt-16 mb-16 mx-auto">
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3 mt-6">
                            <div className="md:flex">
                                <div className="md:flex-shrink-0">
                                    <img className="h-48 w-full object-cover md:w-48" src={imageUrl} alt="Card image" />
                                </div>
                                <div className="p-8">
                                    <h6 className="block mt-1 text-lg leading-tight font-medium text-black">Obra/Pza # {ethers.utils.formatUnits(asset.assetId, 0)}</h6>
                                    <p className="mt-2 text-gray-500">Titulo: {asset.titulo}</p>
                                    <p className="mt-2 text-gray-500">Descripción: {asset.small_description}</p>
                                    <p className="mt-2 text-gray-500">Precio: {ethers.utils.formatEther(asset.price)} ETH</p>
                                    {showMore && (
                                        <>
                                            <p className="mt-2 text-gray-500">Autor: {asset.autor}</p>
                                            <p className="mt-2 text-gray-500">Fecha de inicio del proyecto: {asset.projectStartDate}</p>
                                            <p className="mt-2 text-gray-500">Fecha de finalización del proyecto: {asset.projectEndDate}</p>
                                            <p className="mt-2 text-gray-500">Fracciones NFT: {ethers.utils.formatUnits(asset.NFTFractional, 0)}</p>
                                            <p className="mt-2 text-gray-500">Cláusulas de garantía de pago: {asset.paymentGuaranteeClauses}</p>
                                        </>
                                    )}
                                    <button className="mt-4 px-4 py-2 text-white font-light tracking-wider bg-gray-900 rounded" onClick={() => setShowMore(!showMore)}>
                                        {showMore ? 'Ver menos' : 'Ver más'}
                                    </button>
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
