import React from 'react';
import block from '../assets/block.png';
import cube from '../assets/cube.png'
import '../styles/styles.css'

const Card = () => {
    return (
        <div className="w-full max-w-7xl mx-auto rounded overflow-hidden shadow-lg bg-white p-6 mb-8 flex">
            <div className="flex-1">
                <div className="flex items-center mb-4">
                    <div className="p-2 mr-4">
                        <img src={cube} alt="Cube" className='w-24 h-24 rounded' />
                    </div>
                    <h1 className="text-xl font-bold">IPFS</h1>
                </div>
                <p className="text-gray-700 text-base mb-4">
                    The blazing fast, unlimited scale web3 media and data storage platform.
                </p>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Learn more
                </button>
            </div>
            <div className="w-1/2"> {/* Ajuste de ml-8 para mover la imagen al lado derecho */}
                <img src={block} alt="Block" className="w-64 h-64 rounded" />
            </div>
        </div>
    );
}

export default Card;
