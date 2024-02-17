import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home.jsx';
import Body from './components/Body.jsx';
import Footer from './landing/Footer.jsx';
import './styles/styles.css'
import Shop from "./ecommerce/Shop.jsx"
import PaymentDetails from "./components/PaymentDetails.jsx";
import Card from './landing/Card.jsx';
import PaymentButton from "./components/Pay.jsx"
import { ChakraProvider } from "@chakra-ui/react";
import LoggedOut  from './components/LoggetOut.jsx';
import ItemsUploader from "./components/Providers.jsx"
import AddAsset from "./components_NFT/CreateToken.jsx"
import FetchAllAssets from "./components_NFT/Gettokens.jsx"
import Balance from "./components_NFT/balance.jsx"
import { WalletProvider } from './components/WalletContext.jsx';
import { AuthProvider } from './components/AuthContext.jsx'; // importa el AuthProvider
import withAuthentication from './components/withAuthentication.jsx';
import Mediun from './landing/Mediun.jsx';
import YourInvest from './components_NFT/YourInvest.jsx'
import YourTokens from './components_NFT/Your_Tokens.jsx'
import Checkout from './components/checkout.jsx'
import UserProfile from './ecommerce/Profile.jsx';
import Formulario from './components/CreateProfile.jsx'
import Inbox from './ecommerce/Inbox.jsx';


function App() {


  const AddAssetWithAuth = withAuthentication(AddAsset);
  const ItemsUploaderWithAuth = withAuthentication(ItemsUploader);

  const navigate = useNavigate();

  const handleCreatePayment = () => {
    navigate('/other/shop');
  };

  const GetTokens = () => {
    navigate('/other/gettokens');
  };

  const handleCreateTokens = () => {
    navigate('/other/createtokens');
  };
  const handleuploaderClick = () => {
    navigate('/other/createitems');
  };

  return (
    <WalletProvider>
    <AuthProvider> {/* envuelve tu aplicación con el AuthProvider */}
        <Routes>
        <Route
              path="/"
              element={
                <>
                <Home className="bg-white"/>
                  <Body
                    onCreatePayment={handleCreatePayment}
                    getTokens={GetTokens}
                    onCreateTokens={handleCreateTokens}
                    onCreateItems={handleuploaderClick}
                  />
                  <Mediun/>
                  <Card/>
                  <Footer />
                </>
              }
            />
          <Route path="/other/shop" element={<Shop/>} />
          <Route path="/other/createtokens" element={<AddAsset/>} />
          <Route path="/other/profile" element={<UserProfile/>} />
          <Route path="/other/invests" element={<YourInvest/>} />
          <Route path="/other/tokens" element={<YourTokens/>} />
          <Route path="/other/createitems" element={<ItemsUploader />} />
          <Route path="/other/createmessage" element={<Inbox />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/other/items" element={<ItemsUploader/>} />
          <Route path="/other/gettokens" element={<FetchAllAssets/>} /> 
          <Route path="/login" element={<LoggedOut />} />
          <Route path="/status" element={<PaymentDetails />} />
          <Route path="/pay" element={<PaymentButton />} />
        </Routes>
    </AuthProvider>
    </WalletProvider>
  );
};

export default () => (
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
