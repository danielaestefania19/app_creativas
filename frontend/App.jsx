import React, { useEffect, useContext } from 'react';
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
import Checkout from './ecommerce/Checkout.jsx'
import UserProfile from './ecommerce/Profile.jsx';
import Formulario from './components/CreateProfile.jsx'
import Inbox from './ecommerce/Inbox.jsx';
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { CartProvider } from "../frontend/ecommerce/CartContext.jsx";


function App() {



  const Eccomerce = withAuthentication(Shop);
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
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home className="bg-white" />
                <Body
                  onCreatePayment={handleCreatePayment}
                  getTokens={GetTokens}
                  onCreateTokens={handleCreateTokens}
                  onCreateItems={handleuploaderClick}
                />
                <Mediun />
                <Card />
                <Footer />
              </>
            }
          />
          <Route path="/other/shop" element={<Shop />} /> {/* Usa eccomerce aquí */}
          <Route path='/other/checkout' element={
            <CartProvider>
              <Checkout />
            </CartProvider>
          } />
          <Route path="/other/createtokens" element={<AddAsset />} />
          <Route path="/other/profile" element={<UserProfile />} />
          <Route path="/other/invests" element={<YourInvest />} />
          <Route path="/other/tokens" element={<YourTokens />} />
          <Route path="/other/createitems" element={<ItemsUploader />} />
          <Route path="/other/createmessage" element={<Inbox />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/other/items" element={<ItemsUploader />} />
          <Route path="/other/gettokens" element={<FetchAllAssets />} />
          <Route path="/status" element={<PaymentDetails />} />
          <Route path="/pay" element={<PaymentButton />} />


        </Routes>
        <ToastContainer />
      </AuthProvider>
    </WalletProvider>


  );
};

export default () => (
  <ChakraProvider>
    <App />
  </ChakraProvider>
);