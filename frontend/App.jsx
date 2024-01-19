import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home.jsx';
import Body from './components/Body.jsx';
import './styles/styles.css'
import Shop from "./components/Shop.jsx"
import PaymentDetails from "./components/PaymentDetails.jsx";
import PaymentButton from "./components/Pay.jsx"
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./components/Login.jsx"
import ItemsUploader from "./components/Providers.jsx"
import AddAsset from "./components_NFT/CreateToken.jsx"
import FetchAllAssets from "./components_NFT/Gettokens.jsx"
import Balance from "./components_NFT/balance.jsx"
import { AuthProvider } from './components/AuthContext.jsx'; // importa el AuthProvider

function App() {
  const navigate = useNavigate();

  const handleCreatePayment = () => {
    navigate('/other/shop');
  };

  const handleCreateTokens = () => {
    navigate('/other/createtokens');
  };
  const handleuploaderClick = () => {
    navigate('/other/items');
  };

  return (
    <AuthProvider> {/* envuelve tu aplicación con el AuthProvider */}
      <div className="App">
        <Home/>
        <Routes>
          <Route path="/" element={<Body onCreatePayment={handleCreatePayment} getTokens={ItemsUploader} onCreateTokens={handleCreateTokens} />} />
          <Route path="/other/shop" element={<ItemsUploader/>} />
          <Route path="/other/createtokens" element={<AddAsset/>} />
          <Route path="/other/items" element={<ItemsUploader/>} />
          <Route path="/other/gettokens" element={<FetchAllAssets />} /> {/* Agrega esta línea */}
          <Route path="/status" element={<PaymentDetails />} />
          <Route path="/pay" element={<PaymentButton />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default () => (
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
