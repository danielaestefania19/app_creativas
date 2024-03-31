import React, { useState, useEffect, createContext } from 'react';
import { AuthClient, IdbStorage } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { eccomerce, createActor as createEccomerceActor } from "../../src/declarations/eccomerce";
import { messages, createActor as createMessagesActor } from '../../src/declarations/messages';
import { nft_venture, createActor as createNftVentureActor } from '../../src/declarations/nft_venture';
import { useNavigate } from 'react-router-dom';
import { handleNotifications } from "./Home.jsx"
import { MessagePayload, onMessage } from "firebase/messaging";
import { getFirebaseToken, messaging } from "../FirebaseConfig.jsx";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useIdleTimer } from 'react-idle-timer';
import Formulario from './CreateProfile.jsx';
import Modal from './Modal.jsx';



export const AuthContext = createContext();


const canister_id_1 = import.meta.env.VITE_CANISTER_ECCOMERCE;
const canister_id_2 = import.meta.env.VITE_CANISTER_MESSAGES;
const canister_id_3 = import.meta.env.VITE_CANISTER_NFT_VENTURE;

export const AuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userIdentity, setUserIdentity] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [actor_ecomerce, setActor_Eccomerce] = useState(eccomerce);
  const [actor_messages, setActor_Messages] = useState(messages);
  const [actor_nft_venture, setActor_Nft_Venture] = useState(nft_venture)

  const [lastVisitedRoute, setLastVisitedRoute] = useState('/');
  const [showForm, setShowForm] = useState(false);



  const login = async (method) => {

    const newAuthClient = await AuthClient.create();
    setAuthClient(newAuthClient);

    let identityProvider;
    if (method === 'internetIdentity') {
      identityProvider = process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app"
        : `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:8080`;
    } else if (method === 'nfid') {
      const APP_NAME = "Creativas";
      const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
      const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;
      identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;
    }

    await new Promise((resolve) => {
      newAuthClient.login({
        identityProvider,
        onSuccess: resolve,
        windowOpenerFeatures: `
      left=${window.screen.width / 2 - 525 / 2},
      top=${window.screen.height / 2 - 800 / 2},
      toolbar=0,location=0,menubar=0,width=525,height=800
    `,
        onError: () => {
          toast("Login error");
        },
      });
    });

    const identity = await newAuthClient.getIdentity();
    const agent = new HttpAgent({ identity });

    // Crear los tres actores

    const newActorEccomerce = createEccomerceActor(canister_id_1, { agent });
    const newActorMessages = createMessagesActor(canister_id_2, { agent });
    const newActorNftVenture = createNftVentureActor(canister_id_3, { agent });

    const principalEccomerce = await newActorEccomerce.whoami();
    const principalMessages = await newActorMessages.whoami();
    const principalNftVenture = await newActorNftVenture.whoami();


    // Verifica si los principals son anónimos y si son iguales
    if (!principalEccomerce.isAnonymous() && !principalMessages.isAnonymous() && !principalNftVenture.isAnonymous() &&
      principalEccomerce.toText() === principalMessages.toText() && principalMessages.toText() === principalNftVenture.toText()) {

      setIsUserAuthenticated(await newAuthClient.isAuthenticated());

      setUserIdentity(identity);
      setActor_Eccomerce(newActorEccomerce);
      setActor_Messages(newActorMessages);
      setActor_Nft_Venture(newActorNftVenture);
      const hasProfile = await newActorMessages.has_profile();
      if (!hasProfile) {
        setIsUserAuthenticated(false); // Establece isUserAuthenticated en false
        setShowForm(true); // Muestra el formulario
      } else {
        setIsUserAuthenticated(true); // Establece isUserAuthenticated en true
        setShowForm(false); // Oculta el formulario
      }
    }
  };


  const logout = async () => {
    await authClient?.logout();

    setIsUserAuthenticated(false);
    setUserIdentity(null);
    setActor_Eccomerce(null);
    setActor_Messages(null);
    setActor_Nft_Venture(null);

    sessionStorage.clear();
    localStorage.clear();

    const dbs = await window.indexedDB.databases();
    dbs.forEach(db => {
      window.indexedDB.deleteDatabase(db.name);
    });
    window.location.reload();
  };
  // En AuthProvider
  useEffect(() => {
    const fetchData = async () => {
      const newAuthClient = await AuthClient.create();
      if (newAuthClient.isAuthenticated()) {
        const identity = await newAuthClient.getIdentity();
        const agent = new HttpAgent({ identity });

        // Crear los tres actores

        const newActorEccomerce = createEccomerceActor(canister_id_1, { agent });
        const newActorMessages = createMessagesActor(canister_id_2, { agent });
        const newActorNftVenture = createNftVentureActor(canister_id_3, { agent });

        const principalEccomerce = await newActorEccomerce.whoami();
        const principalMessages = await newActorMessages.whoami();
        const principalNftVenture = await newActorNftVenture.whoami();

        // Verifica si los principals son anónimos y si son iguales
        if (!principalEccomerce.isAnonymous() && !principalMessages.isAnonymous() && !principalNftVenture.isAnonymous() &&
          principalEccomerce.toText() === principalMessages.toText() && principalMessages.toText() === principalNftVenture.toText()) {
          const hasProfileMessages = await newActorMessages.has_profile();
          if (hasProfileMessages) {
            // Aquí es donde actualizas el estado
            setIsUserAuthenticated(true);
            setUserIdentity(identity);
            setActor_Eccomerce(newActorEccomerce);
            setActor_Messages(newActorMessages);
            setActor_Nft_Venture(newActorNftVenture);
          } else {
            setIsUserAuthenticated(false);
          }
        } // Aquí es donde faltaba una llave de cierre
      }
    };
    fetchData();
  }, []); // Sin dependencias para que useEffect se ejecute solo una vez

  const onIdle = async () => {
    console.log("Usuario inactivo");
    if (isUserAuthenticated) {
      console.log("Desactivando perfil...");
      await actor_messages.desactivate_profile();
    }
  };

  const onActive = async () => {
    console.log("Usuario activo");
    if (isUserAuthenticated) {
      console.log("Activando perfil...");
      await actor_messages.activate_profile();
    }
  };

  useIdleTimer({
    onIdle,
    onActive,
    timeout: 1000 * 60 * 1, // 1 minutos
    debounce: 500
  });


  return (
    <AuthContext.Provider value={{
      isUserAuthenticated,
      setIsUserAuthenticated, // Añade esto
      userIdentity,
      login,
      logout,
      lastVisitedRoute,
      setLastVisitedRoute,
      actor_ecomerce,
      actor_messages,
      actor_nft_venture,
      setShowForm
    }}>
      <Modal show={showForm} onClose={() => setShowForm(false)}>
        <Formulario />
      </Modal>
      {children}

    </AuthContext.Provider>
  );
};
