// import { writable } from 'svelte/store';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import React from 'react';
import { Input, Button } from "@chakra-ui/react";
import { eccomerce, createActor } from "../../src/declarations/eccomerce";

let actor = eccomerce;

// const API_URL = import.meta.env.CANISTER_ID_INTERNET_IDENTITY;
// console.log(API_URL)


Principal.anonymous()

// console.log(API_URL)

const Login = () => {
const [whoami, setWhoami] = React.useState(null);

const local_ii_url = `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:8000`;
    const callInternetIdentity = async () => {
      let iiUrl;
      if (process.env.DFX_NETWORK === "local") {
        iiUrl = local_ii_url;
      } else if (process.env.DFX_NETWORK === "ic") {
        //llama a
        iiUrl = `https://identity.ic0.app`;
      } else {
        iiUrl = local_ii_url;
      }
      const authClient = await AuthClient.create();
  
      await new Promise((resolve) => {
        authClient.login({
          identityProvider: iiUrl,
          onSuccess: resolve,
          onError: () => {
            alert("Login error");
          },
        });
      });
  
      const identity = await authClient.getIdentity();
      const agent = new HttpAgent({ identity });
  
      actor = createActor('bd3sg-teaaa-aaaaa-qaaba-cai', {
          agent,
      });

// if (Principal.anonymous() ==  await actor.whoami()) {

      //   console.log("Es anonymous")

      // }

const principal = await actor.whoami();
  console.log(principal.toString());
  setWhoami(principal.toString());
};

return (
    <div className="CompletePayment" style={{ position: 'fixed', bottom: '50px', width: '100%', display: 'flex', justifyContent: 'center' }}>
       <Button size="sm" onClick={callInternetIdentity}>
                  LogIn with Internet Identity ∞
          </Button>
          <div>
            <p>Principal: {whoami}</p>
          </div>
    </div>
)

}

export default Login;