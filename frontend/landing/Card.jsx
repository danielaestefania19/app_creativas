import React from 'react';
import block from '../assets/block.png';
import cube from '../assets/cube.png'
import web3 from '../assets/web3.png'
import web3logo from '../assets/web3logo.avif'
import Web3NFT from "../assets/Web3NFT.png"
import '../styles/styles.css'

const Card = () => {
    return (
        <div className="py-2">
            <div className="w-full max-w-screen-xl h-96 mx-auto rounded-2xl overflow-hidden shadow-lg bg-white p-6 mb-8 flex hover:scale-105 duration-300">
                <div className="flex-1">
                    <div className="mb-4">
                        <div className="p-2 mr-4">
                            <img src={cube} alt="Cube" className='w-24 h-24 rounded' />
                        </div>
                        <h1 className="text-xl font-bold">Blockchain</h1>
                    </div>
                    <p className="text-gray-700 text-base mb-4">
                    We utilize blockchain technology to ensure transparency and trustworthiness in all our transactions.
                    </p>
                    <button type="button" class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 rounded font-bold px-4 py-2 text-center">Learn More</button>
                </div>
                <div className="mr-8">
                    <img src={block} alt="Block" className="w-64 h-64 rounded mt-6" />
                </div>
            </div>
            <div className="w-full max-w-screen-xl h-96 mx-auto rounded-2xl overflow-hidden shadow-lg bg-white p-6 mb-8 flex hover:scale-105 duration-300">
                <div className="flex-1">
                    <div className="mb-4">
                        <div className="p-2 mr-4">
                            <img src={web3logo} alt="Cube" className='w-24 h-24 rounded' />
                        </div>
                        <h1 className="text-xl font-bold">Web3</h1>
                    </div>
                    <p className="text-gray-700 text-base mb-4">
                    We implement web3 technology to empower our users, allowing them to interact in a decentralized and secure ecosystem.
                    </p>
                    <button type="button" class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 rounded font-bold px-4 py-2 mt-6 text-center">Learn More</button>
                </div>
                <div className="mr-8">
                    <img src={Web3NFT} alt="Block" className="w-80 h-64 rounded mt-6" />
                </div>
            </div>

        </div>
    );
}

export default Card;

