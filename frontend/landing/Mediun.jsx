import React from 'react';
import NFT from '../assets/NFT.jpg'
import Pago from '../assets/Pago.jpg'

const Mediun = () => {
  return (
    <div className='w-full py-[6rem] px-4 bg-white'>
      <div className='max-w-[1240px] mx-auto grid md:grid-cols-2 gap-8'>
          <div className='w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300'>
          <img className='w-64 mx-auto mt-[-3rem] bg-white' src={Pago} alt="/" />
              <h2 className='text-2xl font-bold text-center py-8'>Pasarela de Pagos</h2>
              <button className='bg-[#c9398a] w-[200px] font-medium my-6 mx-auto py-3 text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 rounded-lg '>Start Trial</button>
          </div>
          <div className='w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300'>
              <img className='w-64 mx-auto mt-[-3rem] bg-white' src={NFT} alt="/" />
              <h2 className='text-2xl font-bold text-center py-8'>Marketplece NFT</h2>
              <button className='bg-[#c9398a] w-[200px] font-medium my-6 mx-auto py-3 text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 rounded-lg'>Start Trial</button>
          </div>
      </div>
    </div>
  );
};

export default Mediun;
