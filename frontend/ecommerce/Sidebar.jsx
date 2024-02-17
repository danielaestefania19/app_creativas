import React, { useState } from 'react';
import { GoHome, GoFlame, GoHeart, GoPerson, GoInbox } from 'react-icons/go';
import { Link } from 'react-router-dom';
import profileicon from '../assets/profileicon.png'
import seller from '../assets/seller.png'

export function DefaultSidebar() {
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const expandSidebar = () => {
    setExpanded(true);
  };

  const collapseSidebar = () => {
    setExpanded(false);
  };

  return (
    <div className={`bg-pink text-black w-${expanded ? '64' : '16'} 
  flex flex-col items-center transition-all duration-300 h-screen cursor-pointer`}
  onMouseEnter={expandSidebar} onMouseLeave={collapseSidebar} >
  <div className="mb-8">
    <div className="rounded-[.95rem] flex items-center mb-4">
      <img className="w-[40px] h-[40px] shrink-0 inline-block rounded-[.95rem] mr-4" src={profileicon} alt="avatar image" />
      {expanded && <p className="ml-2">Creativas</p>}
    </div>
    <div className="flex flex-col"> {/* Nuevo contenedor para iconos y Seller */}
      <div className="flex items-center mb-4">
        <GoHome className="text-3xl mr-2" />
        {expanded && <p className="ml-2">Home</p>}
      </div>
      <div className="flex items-center mb-4">
        <GoFlame className="text-3xl mr-4" />
        {expanded && <p className="ml-2">Tendencias</p>}
      </div>
      <div className="flex items-center mb-4">
        <GoHeart className="text-3xl mr-4" />
        {expanded && <p className="ml-2">Favorites</p>}
      </div>
      <div className="flex items-center mb-4">
        <GoPerson className="text-3xl mr-4" />
        {expanded && <p className="ml-2">Profile</p>}
      </div>
      <div className="flex items-center mb-4">
      <Link to="/other/createmessage">
        <GoInbox className="text-3xl mr-4" />
        {expanded && <p className="ml-2">Inbox</p>} </Link>
      </div>
    </div>
    <div className="rounded-[.95rem] flex items-center mb-4">
      <Link to="/other/createitems">
        <img className="w-[40px] h-[40px] shrink-0 inline-block rounded-[.95rem] mr-4" src={seller} alt="avatar image" />
        {expanded && <p className="ml-2">Seller</p>} </Link>
    </div>
  </div>
</div>
  );
}
