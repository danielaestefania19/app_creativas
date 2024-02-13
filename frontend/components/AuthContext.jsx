import React, { useState, useEffect, createContext } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { eccomerce, createActor } from "../../src/declarations/eccomerce";
import { useNavigate } from 'react-router-dom'; // Importa useNavigate aquí

export const AuthContext = createContext();

const canister_id = import.meta.env.VITE_CANISTER_ID;


const network = import.meta.env.VITE_DFX_NETWORK;



export const AuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userIdentity, setUserIdentity] = useState(null);
  const [userPrincipal, setUserPrincipal] = useState(null);
  const [authClient, setAuthClient] = useState(null); 
  const [actor, setActor] = useState(eccomerce);
  const [whoami, setWhoami] = useState(null); // Nueva variable de estado
  const [lastVisitedRoute, setLastVisitedRoute] = useState('/'); 
  const navigate = useNavigate(); // Usa useNavigate aquí

  const login = async () => {
    const local_ii_url = `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:7070`;
    let iiUrl;
    if (process.env.DFX_NETWORK === "local") {
      iiUrl = local_ii_url;
    } else if (process.env.DFX_NETWORK === "ic") {
      iiUrl = `https://identity.ic0.app`;
    } else {
      iiUrl = local_ii_url;
    }
    const newAuthClient = await AuthClient.create();
    setAuthClient(newAuthClient); 

    await new Promise((resolve) => {
      newAuthClient.login({
        identityProvider: iiUrl,
        onSuccess: resolve,
        onError: () => {
          alert("Login error");
        },
      });
    });

    const identity = await newAuthClient.getIdentity();
    const agent = new HttpAgent({ identity });

    const newActor = createActor(canister_id, { agent });

    const principal = await newActor.whoami();
    console.log(principal.toText());

    setIsUserAuthenticated(await newAuthClient.isAuthenticated());
    setWhoami(principal.toText()); // Guardar el valor de principal.toText() en whoami
    setUserIdentity(identity);
    setUserPrincipal(principal);
    setActor(newActor);

    // Mueve la comprobación del perfil aquí
    const hasProfile = await newActor.has_profile();
    console.log("Bool:", hasProfile)

    if (!hasProfile) {
      navigate('/formulario'); // Navega al formulario
    }
  };

  const logout = async () => {
    await authClient?.logout(); 
    setIsUserAuthenticated(false);
    setUserIdentity(null);
    setUserPrincipal(null);
    setActor(null);
  };

  useEffect(() => {
    if (userPrincipal) {
      const agent = new HttpAgent({ identity: userIdentity });
      const newActor = createActor(canister_id, { agent });
      setActor(newActor);
    }
  }, [userPrincipal, userIdentity]);

  return (
    <AuthContext.Provider value={{ 
      isUserAuthenticated, 
      userIdentity, 
      userPrincipal, 
      login, 
      logout,
      lastVisitedRoute, 
      setLastVisitedRoute,
      actor,
      whoami // Agregar whoami al contexto
    }}>
      {children}
    </AuthContext.Provider>
  );
};