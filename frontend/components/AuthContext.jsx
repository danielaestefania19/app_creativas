import React, { useState, useEffect, createContext } from 'react';
import { AuthClient, IdbStorage } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { eccomerce, createActor } from "../../src/declarations/eccomerce";
import { useNavigate } from 'react-router-dom';
import { handleNotifications } from "./Home"
import { MessagePayload, onMessage } from "firebase/messaging";
import { getFirebaseToken, messaging } from "../FirebaseConfig.jsx";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useIdleTimer } from 'react-idle-timer';

// import useProfileActivity from './useProfileActivity.jsx'; // Importa useProfileActivity aquí

export const AuthContext = createContext();

const storage = new IdbStorage(); // Crea una nueva instancia de AuthClientStorage


const canister_id = import.meta.env.VITE_CANISTER_ID;

const network = import.meta.env.VITE_DFX_NETWORK;
export const AuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userIdentity, setUserIdentity] = useState(null);
  const [userPrincipal, setUserPrincipal] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [actor, setActor] = useState(eccomerce);
  const [whoami, setWhoami] = useState(null);
  const [lastVisitedRoute, setLastVisitedRoute] = useState('/');
  const navigate = useNavigate();


  const login = async () => {
    const local_ii_url = `http://br5f7-7uaaa-aaaaa-qaaca-cai.localhost:7070`;
    let iiUrl;
    if (process.env.DFX_NETWORK === "local") {
      iiUrl = local_ii_url;
    } else if (process.env.DFX_NETWORK === "ic") {
      iiUrl = `https://identity.ic0.app`;
    } else {
      iiUrl = local_ii_url;
    }

    let mainnet = `http://br5f7-7uaaa-aaaaa-qaaca-cai.localhost:8000`;

    const newAuthClient = await AuthClient.create();
    setAuthClient(newAuthClient);

    await new Promise((resolve) => {
      newAuthClient.login({
        identityProvider: mainnet,
        onSuccess: resolve,
        onError: () => {
          toast("Login error");
        },
      });
    });

    const identity = await newAuthClient.getIdentity();
    const agent = new HttpAgent({ identity });

    const newActor = createActor(canister_id, { agent });

    const principal = await newActor.whoami();

    console.log(principal.toText())

    setIsUserAuthenticated(await newAuthClient.isAuthenticated());
    setWhoami(principal.toText());
    setUserIdentity(identity);
    setUserPrincipal(principal);
    setActor(newActor);
    const hasProfile = await newActor.has_profile();
    if (!hasProfile) {
        setIsUserAuthenticated(false); // Establece isUserAuthenticated en false
        navigate('/formulario');
    } else {
        setIsUserAuthenticated(true); // Establece isUserAuthenticated en true
    }
};

const logout = async () => {
    await authClient?.logout();

    setIsUserAuthenticated(false);
    setUserIdentity(null);
    setUserPrincipal(null);
    setActor(null);

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

      const newActor = createActor(canister_id, { agent });

      const principal = await newActor.whoami();
      console.log(principal.toText())
      // Verifica si el principal es anónimo
      if (!principal.isAnonymous()) {
        const hasProfile = await newActor.has_profile();
        if (hasProfile) {
          // Aquí es donde actualizas el estado
          setIsUserAuthenticated(true);
          setWhoami(principal.toText());
          setUserIdentity(identity);
          setUserPrincipal(principal);
          setActor(newActor);
        } else {
          setIsUserAuthenticated(false);
          navigate('/formulario');
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
    await actor.desactivate_profile();
  }
};

const onActive = async () => {
  console.log("Usuario activo");
  if (isUserAuthenticated) {
    console.log("Activando perfil...");
    await actor.activate_profile();
  }
};

useIdleTimer({
  onIdle,
  onActive,
  timeout: 1000 * 60 * 5, // 5 minutos
  debounce: 500
});


  return (
    <AuthContext.Provider value={{
      isUserAuthenticated,
      setIsUserAuthenticated, // Añade esto
      userIdentity,
      userPrincipal,
      login,
      logout,
      lastVisitedRoute,
      setLastVisitedRoute,
      actor,
      whoami
    }}>
      {children}
    </AuthContext.Provider>
  );
};
