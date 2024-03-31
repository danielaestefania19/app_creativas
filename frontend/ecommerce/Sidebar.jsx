import React, { useState, useContext, useEffect } from 'react';
import { GoHome, GoFlame, GoHeart, GoPerson, GoInbox } from 'react-icons/go';
import { Link } from 'react-router-dom';
import profileicon from '../assets/profileicon.png'
import seller from '../assets/seller.png'
import { AuthContext } from '../components/AuthContext'; // Importa AuthContext

export function DefaultSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [profile, setProfile] = useState(null); // Estado para almacenar el perfil del usuario
  const [imageUrl, setImageUrl] = useState(profileicon); // Estado para almacenar la URL de la imagen
  const [isProfileLoaded, setIsProfileLoaded] = useState(false); // Nuevo estado para rastrear si el perfil se ha cargado
  const { actor, actor_messages } = useContext(AuthContext); // Accede al actor aquí

  useEffect(() => {
    const fetchProfile = () => {
      actor_messages.get_user_profile()
        .then(response => {
          if (response.Ok) {
            const userProfile = response.Ok; // Accede a la propiedad Ok de la respuesta
            console.log(userProfile)
            setProfile(userProfile); // Guarda el perfil del usuario en el estado
            if (userProfile.profile_picture !== "") {
              console.log(userProfile.profile_picture)
              const url = `https://green-capable-vole-518.mypinata.cloud/ipfs/${userProfile.profile_picture}`;
              setImageUrl(url); // Actualiza la URL de la imagen
            }
            setIsProfileLoaded(true); // Actualiza el estado cuando el perfil se ha cargado
          } else {
            console.error('Error fetching user profile', response);
          }
        })
        .catch(error => {
          console.error('Error fetching user profile', error);
        });
    };
  
    fetchProfile();
  }, [actor]); // Dependencia del actor para que se ejecute el useEffect cuando cambie el actor
  ``

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
      <img className="w-[40px] h-[40px] shrink-0 inline-block rounded-[.95rem] mr-4" src={isProfileLoaded ? imageUrl : profileicon} alt="avatar image" />
      {expanded && <p className="ml-2">{profile ? profile.username : 'Creativas'}</p>}
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
