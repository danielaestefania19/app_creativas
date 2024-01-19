// auth.js
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { eccomerce, createActor } from "../../src/declarations/eccomerce";

let actor = eccomerce;

export const Login = async () => {
  const local_ii_url = `http://br5f7-7uaaa-aaaaa-qaaca-cai.localhost:8000`;
  let iiUrl;
  if (process.env.DFX_NETWORK === "local") {
    iiUrl = local_ii_url;
  } else if (process.env.DFX_NETWORK === "ic") {
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

  const principal = await actor.whoami();
  console.log(principal.toText());
  return principal.toText();
};


export default Login;