import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { AuthContext } from './AuthContext.jsx';
import favicon from '../assets/favicon.png';
import Logo from '../assets/Logo.png'
import WalletConnect from './WalletConnect.jsx';
import { WalletContext } from './WalletContext.jsx';
import Metamask from '../assets/Metamask.png'
import { onMessage } from "firebase/messaging";
import { messaging } from "../FirebaseConfig.jsx";
import { ToastContainer, toast } from "react-toastify"
import Modal from 'react-modal';

Modal.setAppElement('#root') // Esto es necesario para la accesibilidad

const LoginModal = ({ isOpen, onRequestClose, handleLogin }) => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Login Modal"
      >
        <h2>Iniciar sesión</h2>
        <button onClick={() => handleLogin('internetIdentity')}>Iniciar sesión con Internet Identity</button>
        <button onClick={() => handleLogin('nfid')}>Iniciar sesión con NFID</button>
        <button onClick={onRequestClose}>Cerrar</button>
      </Modal>
    );
  };
  

const Home = () => {
    const [nav, setNav] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const { isUserAuthenticated, login, logout } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        onMessage(messaging, message => {
            console.log("tu mensaje:", message);
            toast(message.notification.title);
        })
    }, []);

    const { defaultAccount } = useContext(WalletContext);
    const handleNav = () => {
        setNav(!nav);
    };
    const handleLogin = async (method) => {
        console.log(method); // Esto imprimirá el método de inicio de sesión en la consola
        // Aquí va tu lógica de inicio de sesión
        await login(method);
    };
    

    const handleLogout = async () => {
        await logout();

    };
    const handleModalToggle = () => {
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;

            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos, visible]);
    return (
        <nav class="bg-gradient-to-b from-[#0c0e15] to-[#323335]">
            <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a class="flex items-center space-x-3 rtl:space-x-reverse">
                    <span class="self-center text-2xl font-semibold whitespace-nowrap text-white ">Creativas</span>
                </a>
                <Link to="/" className="p-4 text-white">Home</Link>
                <h1 className="p-4 text-white">
                    <a href="https://creativas.gitbook.io/creativas/"> Docs </a>
                </h1>
                {isUserAuthenticated ? (
                    <button className="inline-flex items-center justify-center rounded-xl bg-white border dark:border-gray-600 px-3 py-2 text-sm font-semibold text-pink-600 shadow-sm transition-all duration-150" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <>
                        <button className="inline-flex items-center justify-center rounded-xl bg-white  border dark:border-gray-600 px-3 py-2 text-sm font-semibold text-pink-600 shadow-sm transition-all duration-150" onClick={() => setIsModalOpen(true)}>
                            Login
                        </button>
                        <LoginModal
                            isOpen={isModalOpen}
                            onRequestClose={() => setIsModalOpen(false)}
                            handleLogin={handleLogin}
                        />
                    </>
                )}

                <div onClick={handleNav} className="block md:hidden">
                    {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                </div>

                <div className='max-w-[800px] mt-[80px] w-full h-[500px] mx-auto text-center flex flex-col justify-center'>
                    <h1 className='text-white font-extrabold font-manrope md:text-5xl sm:text-4xl text-xl  p-2'>
                        Let's build a freer and more creative world!
                    </h1>
                    <div className='flex justify-center items-center'>
                        <p className='md:text-5xl sm:text-4xl text-xl font-bold py-4'>
                            ¡Let's be creative!
                        </p>
                    </div>
                </div>


            </div>
        </nav>






    );
    //
    //
};

export default Home;
