import React from 'react';
import Typed from 'react-typed';

const Body = ({ onCreatePayment, getTokens }) => {
  return (
    <div className="bg-[#323335] w-full h-screen mt-0">
      <div className='flex justify-between'>
        <div className="w-full max-w-screen-xl mx-auto mb-8 flex flex-col">
          <div className="h-96 rounded-2xl overflow-hidden shadow-lg bg-black p-6 mb-8 hover:scale-105 duration-300">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-xl font-bold">Blockchain</h1>
              </div>
              <p className="text-gray-700 text-base mb-4"></p>
              <button onClick={onCreatePayment} className='bg-[#c9398a] w-[200px] font-medium my-6 mx-auto py-3 text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 rounded-lg '>Ecommerce</button>
            </div>
          </div>

          <div className="h-96 rounded-2xl overflow-hidden shadow-lg bg-black p-6 mb-8 hover:scale-105 duration-300">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-xl font-bold">Web3</h1>
              </div>
              <p className="text-gray-700 text-base mb-4">
                We implement web3 technology to empower our users, allowing them to interact in a decentralized and secure ecosystem.
              </p>
              <button onClick={getTokens} className='bg-[#c9398a] w-[200px] font-medium my-6 mx-auto py-3 text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 rounded-lg '>NFTVentures</button>
            </div>
          </div>
          <div className="h-96 rounded-2xl overflow-hidden shadow-lg bg-black p-6 mb-8 hover:scale-105 duration-300">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-xl font-bold">Blockchain</h1>
              </div>
              <p className="text-gray-700 text-base mb-4"></p>
              <button onClick={onCreatePayment} className='bg-[#c9398a] w-[200px] font-medium my-6 mx-auto py-3 text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 rounded-lg '>Ecommerce</button>
            </div>
          </div>
        </div>
      </div>
    </div>
 
  );
}

export default Body;
