import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Login } from './Login'; // importa la función
import { AuthContext } from './AuthContext'; // importa el contexto

const Home = () => {
  const [nav, setNav] = useState(false);
  const { whoami, setWhoami } = useContext(AuthContext); // usa el contexto

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogin = async () => {
    const principal = await Login();
    setWhoami(principal);
  };

  return (
    <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-black'>
      <h1 className='w-full text-3xl font-bold text-[#FF0091]'>Creativas</h1>
      <ul className='hidden md:flex'>
        <Link to="/" className='p-4'>Home</Link>
        <li className='p-4'>Company</li>
        <li className='p-4'>Resources</li>
        <li className='p-4'>About</li>
        <li className='p-4'>Contact</li>
        <button className='bg-[#c9398a] w-[100px] rounded-md mx-auto p-4 text-white' onClick={handleLogin}>LogIn with Internet Identity ∞</button>
      </ul>
      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20} />}
      </div>
      <ul className={nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#FFEBF6] ease-in-out duration-500' : 'ease-in-out duration-500 fixed left-[-100%]'}>
        <h1 className='w-full text-3xl font-bold text-[#FF0091] m-4'>Creativas</h1>
        <li className='p-4 border-b border-pink-600'>Home</li>
        <li className='p-4 border-b border-pink-600'>Company</li>
        <li className='p-4 border-b border-pink-600'>Resources</li>
        <li className='p-4 border-b border-pink-600'>About</li>
        <li className='p-4'>Contact</li>
      </ul>
      <div>
        <p>Principal: {whoami}</p>
      </div>
    </div>
  );
};

export default Home;
