import React from 'react';
import Typed from 'react-typed';

const Body = ({ onCreatePayment }) => {
  return (
    <div className='text-black bg-[#f7e8f0]'>
      <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
        <p className='text-[#FF0091] font-bold p-2'>
          GROWING WITH FINANCIAL FREEDOM
        </p>
        <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>
          Grow with US.
        </h1>
        <div className='flex justify-center items-center'>
          <p className='md:text-5xl sm:text-4xl text-xl font-bold py-4'>
            Fast, flexible financing for
          </p>
          <Typed
            className='md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2'
            strings={['BFT', 'ETH']}
            typeSpeed={120}
            backSpeed={140}
            loop
          />
        </div>
        <p className='md:text-2xl text-xl font-bold text-black'>Monitor your finances to grow in a barrier-free space by:</p>
        <div className='flex justify-between'>
        <button className='bg-[#c9398a] w-[200px] rounded font-medium my-6 mx-auto py-3 text-white'>Ecommerce</button>
        <button onClick={onCreatePayment} className='bg-[#c9398a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-white'>Marketplace</button>
        </div>
      </div>
    </div>
  );
  }
export default Body;