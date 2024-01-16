import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const Marketplace = ({ assets }) => {
    return (
        <div>
            {assets.map((asset, index) => {
                const [imageUrl, setImageUrl] = useState(null);
                const [pdfUrl, setPdfUrl] = useState(null);

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

                    const fetchPdf = async () => {
                        try {
                            const response = await axios.get(`http://192.168.1.9:5000/fetchPDF/${asset.businessPlanHash}`, {
                                responseType: 'blob'
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
                    <div key={index} className="col-lg-4">
                        <div className="card" style={{color: 'black'}}>
                            <img className="card-img-top" src={imageUrl} alt="Card image" />
                            <div className="card-body">
                                <h6 className="card-title">Obra/Pza # {ethers.utils.formatUnits(asset.assetId, 0)}</h6>
                                <p className="card-title">Autor: {asset.autor}</p>
                                <p className="card-title">Titulo: {asset.titulo}</p>
                                <p className="card-text">Descripción: {asset.small_description}</p>
                                <p className="card-title">Fecha de inicio del proyecto: {asset.projectStartDate}</p>
                                <p className="card-title">Fecha de finalización del proyecto: {asset.projectEndDate}</p>
                                <p className="card-text">Fracciones NFT: {ethers.utils.formatUnits(asset.NFTFractional, 0)}</p>
                                <p className="card-text">Cláusulas de garantía de pago: {asset.paymentGuaranteeClauses}</p>
                                <p className="card-text">Precio: {ethers.utils.formatEther(asset.price)} ETH</p>
                            </div>
                            <a href={imageUrl} className="btn btn-primary stretched-link">Ampliar</a>
                            <a href={pdfUrl} className="btn btn-primary stretched-link">Ver PDF</a>
                            <div className="card-footer">
                                <small><b>Propietario:</b> {asset.owner}<br /><b>Aprobado:</b> {asset.approval}</small>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Marketplace;
