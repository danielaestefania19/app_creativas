import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from '../components/AuthContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Inbox = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [privateChat, setPrivateChat] = useState([]);
  const [profiles, setProfiles] = useState({});
  const { whoami, actor } = useContext(AuthContext); 

  useEffect(() => {
    actor.get_inbox().then((data) => {
      console.log("Inbox data: ", data);
      if (data && data.Ok && Array.isArray(data.Ok.conversations)) {
        const chats = data.Ok.conversations;
        setChats(chats);
  
        // Obtén y guarda los perfiles para todos los chats
        chats.forEach((chat) => {
          console.log(chat.other_user)
          actor.get_profile_by_principal(chat.other_user).then((profile) => {
            console.log(chat.other_user )
            if (profile && profile.Ok) {
              setProfiles((prevProfiles) => ({
                ...prevProfiles,
                [chat.other_user]: profile.Ok,
              }));
            } else {
              console.error('get_profile_by_principal did not return a profile:', profile);
            }
          });
        });
      } else {
        console.error('get_inbox did not return an array:', data);
      }
    });
  }, [actor]);
  
  useEffect(() => {
    if (selectedChat) {
      actor.get_private_chat(selectedChat.other_user).then((data) => {
        if (data && data.Ok && Array.isArray(data.Ok)) {
          setPrivateChat(data.Ok);
        } else {
          console.error('get_private_chat did not return an array:', data);
        }
      });
  
      // Llama a get_profile_by_principal con selectedChat.other_user
      actor.get_profile_by_principal(selectedChat.other_user).then((profile) =>  {
        if (profile && profile.Ok) {
          // Guarda el perfil en el estado
          setProfiles((prevProfiles) => ({
            ...prevProfiles,
            [selectedChat.other_user]: profile.Ok,
          }));
        } else {
          console.error('get_profile_by_principal did not return a profile:', profile);
        }
      });
    }
  }, [selectedChat, actor]);
  
  return (
    <div className="h-screen">
      <div className="container mx-auto">
        <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
          <div className="border-r border-gray-300 lg:col-span-1">
            <div className="mx-3 my-3">
              <div className="relative text-gray-600">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-gray-300"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </span>
                <input
                  type="search"
                  className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
                  name="search"
                  placeholder="Search"
                  required
                />
              </div>
            </div>

            <ul className="overflow-auto h-[32rem]">
              <h2 className="my-2 mb-2 ml-2 text-lg text-gray-600">Chats</h2>
              {chats.map((chat, index) => (
                <li key={index}>
                  <a
                    onClick={() => setSelectedChat(chat)}
                    className={`flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer ${chat.unread ? 'bg-gray-100' : ''} focus:outline-none`}
                  >
                    <div>
                      {/* Muestra el nombre de usuario del perfil en lugar de chat.other_user */}
                      <h3>{profiles[chat.other_user]?.username}</h3>
                      <p>{chat.last_message.content}</p>
                    </div>
                    {chat.unread_count > 0 && <span>{chat.unread_count}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden lg:col-span-2 lg:block">
            <div className="w-full">
              <div className="relative flex items-center p-3 border-b border-gray-300">
                {/* ... Contenido del encabezado del chat ... */}
              </div>
              <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
                <ul className="space-y-2">
                  {privateChat.map((message, index) => (
                    <li key={index}>
                      <p>{message.content}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                {/* ... Contenido de los botones y el input de mensaje ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Inbox;