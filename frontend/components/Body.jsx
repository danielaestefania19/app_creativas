import React from 'react';
import Typed from 'react-typed';

const Body = ({ onCreatePayment, getTokens }) => {
  return (
    <div className='text-black bg-white pt-20 pb-8'>
      <div className='max-w-[800px] mt-[80px] w-full h-[500px] mx-auto text-center flex flex-col justify-center'>
        <p className='text-[#FF0091] font-bold p-2'>
              Financial Freedom
        </p>
        <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>
          Grow with US.
        </h1>
        <div className='flex justify-center items-center'>
          <p className='md:text-5xl sm:text-4xl text-xl font-bold py-4'>
            ¡Let's be creative!

            <Typed
              className='md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2'
              strings={['BFT', 'ETH']}
              typeSpeed={120}
              backSpeed={140}
              loop
            />
          </p>
        </div>
        <p className='md:text-2xl text-xl font-bold text-black'>“Empowering female entrepreneurs around the globe to sell their products and/or services.”​</p>
        <div className='flex justify-between'>
          <button onClick={onCreatePayment} className='bg-[#c9398a] w-[200px] font-medium my-6 mx-auto py-3 text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 rounded-lg '>Ecommerce</button>
          <button onClick={getTokens} className='bg-[#c9398a] w-[200px] font-medium my-6 mx-auto py-3 text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 rounded-lg '>Marketplace</button>
        </div>
      </div>
    </div>
  );
}
export default Body;