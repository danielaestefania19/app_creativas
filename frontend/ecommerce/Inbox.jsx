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
    const [messageContent, setMessageContent] = useState("");
    // Estado para el formulario de nuevo chat
    const [newChat, setNewChat] = useState({ addressee: '', content: '' });

    useEffect(() => {
        const intervalId = setInterval(() => {
            actor.get_inbox().then((data) => {
                console.log("Inbox data: ", data);
                if (data && data.Ok && Array.isArray(data.Ok.conversations)) {
                    const chats = data.Ok.conversations;
                    setChats(chats);

                    // Obtén y guarda los perfiles para todos los chats
                    chats.forEach((chat) => {
                        actor.get_profile_by_principal(chat.other_user).then((profile) => {
                            console.log(chat.other_user)
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
        }, 2000); // Actualiza cada 5 segundos

        // Asegúrate de limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, [actor]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (selectedChat) {
                actor.get_private_chat(selectedChat.other_user).then((data) => {
                    if (data && data.Ok && Array.isArray(data.Ok)) {
                        setPrivateChat(data.Ok);
                    } else {
                        console.error('get_private_chat did not return an array:', data);
                    }
                });

                // Llama a get_profile_by_principal con selectedChat.other_user
                actor.get_profile_by_principal(selectedChat.other_user).then((profile) => {
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
        }, 2000); // Actualiza cada 5 segundos

        // Asegúrate de limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, [selectedChat, actor]);

    // Manejador para el evento onChange del campo de entrada
    const handleInputChange = (event) => {
        setMessageContent(event.target.value);
    };

    // Manejador para el evento onClick del botón de enviar
    const handleSendClick = () => {
        // Crea el objeto message
        const message = {
            content: messageContent,
            addressee: selectedChat.other_user, // Asegúrate de que selectedChat esté definido
        };

        // Llama a la función send_message
        actor.send_message(message).then((result) => {
            if (result instanceof Error) {
                console.error('Error al enviar el mensaje:', result);
            } else {
                console.log('Mensaje enviado con éxito');
                // Limpia el campo de entrada
                setMessageContent("");
            }
        });
    };

    // Manejadores para los eventos onChange de los campos de entrada
    const handleAddresseeChange = (event) => {
        setNewChat({ ...newChat, addressee: event.target.value });
    };
    const handleContentChange = (event) => {
        setNewChat({ ...newChat, content: event.target.value });
    };

    // Manejador para el evento onClick del botón de nuevo chat
    const handleNewChatClick = () => {
        // Crea el objeto message
        const message = {
            content: newChat.content,
            addressee_text: newChat.addressee.toText(),

        };
        console.log(addressee_text)
        // Llama a la función send_message
        actor.send_message_2(message).then((result) => {
            if (result instanceof Error) {
                console.error('Error al enviar el mensaje:', result);
            } else {
                console.log('Nuevo chat iniciado con éxito');
                // Limpia los campos de entrada
                setNewChat({ addressee: '', content: '' });
            }
        });
    };


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
                                <div class="relative w-full p-6 overflow-y-auto h-[40rem]">
                                    <ul class="space-y-2">
                                        <li class="flex justify-start">
                                            <div class="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                                                <span class="block">Hi</span>
                                            </div>
                                        </li>
                                        <li class="flex justify-end">
                                            <div class="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                                                <span class="block">Hiiii</span>
                                            </div>
                                        </li>
                                        <li class="flex justify-end">
                                            <div class="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                                                <span class="block">how are you?</span>
                                            </div>
                                        </li>
                                        <li class="flex justify-start">
                                            <div class="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                                                <span class="block">Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
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
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </button>

                                <input type="text"
                                    placeholder="Message"
                                    className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                                    name="message"
                                    value={messageContent}
                                    onChange={handleInputChange}
                                    required
                                />

                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                                <button type="submit" onClick={handleSendClick}>
                                    <svg class="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                </button>

                                {/* ... Contenido de los botones y el input de mensaje ... */}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Addressee"
                                    value={newChat.addressee}
                                    onChange={handleAddresseeChange}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Message"
                                    value={newChat.content}
                                    onChange={handleContentChange}
                                    required
                                />
                                <button type="submit" onClick={handleNewChatClick}>
                                    Iniciar nuevo chat
                                </button>
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