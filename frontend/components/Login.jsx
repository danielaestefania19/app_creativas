import { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { eccomerce, createActor } from "../../src/declarations/eccomerce";

let actor = eccomerce;

export const useAuth = () => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userIdentity, setUserIdentity] = useState(null);
  const [userPrincipal, setUserPrincipal] = useState(null);
  const [authClient, setAuthClient] = useState(null); 
  

  const login = async () => {
    const local_ii_url = `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:5000`;
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

    actor = createActor('bd3sg-teaaa-aaaaa-qaaba-cai', {
      agent,
    });

    const principal = await actor.whoami();
    console.log(principal.toText());

    setIsUserAuthenticated(await newAuthClient.isAuthenticated());
    setUserIdentity(identity);
    setUserPrincipal(principal.toText());
    return principal.toText();
  };

  const logout = async () => {
    await authClient?.logout(); 
    setIsUserAuthenticated(false);
    setUserIdentity(null);
    setUserPrincipal(null);
  };

  useEffect(() => {
  }, []);

  return { isUserAuthenticated, userIdentity, userPrincipal, login, logout }; 
};
