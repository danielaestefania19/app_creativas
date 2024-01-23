import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home.jsx';
import Body from './components/Body.jsx';
import Footer from './landing/Footer.jsx';
import './styles/styles.css'
import Shop from "./components/Shop.jsx"
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
        <div className="App">
          <Home className="bg-white"/>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Body
                    onCreatePayment={handleCreatePayment}
                    getTokens={GetTokens}
                    onCreateTokens={handleCreateTokens}
                    onCreateItems={handleuploaderClick}
                  />
                  <Card/>
                  <Footer />
                </>
              }
            />
            <Route path="/other/shop" element={<Shop/>} />
            <Route path="/other/createtokens" element={<AddAssetWithAuth/>} /> {/* Usa AddAssetWithAuth aquí */}
            <Route path="/other/createitems" element={<ItemsUploaderWithAuth />} /> {/* Y aquí */}
            <Route path="/other/items" element={<ItemsUploader/>} />
            <Route path="/other/gettokens" element={<FetchAllAssets />} /> {/* Agrega esta línea */}
            <Route path="/login" element={<LoggedOut />} />
            <Route path="/status" element={<PaymentDetails />} />
            <Route path="/pay" element={<PaymentButton />} />
          </Routes>
        </div>
      </AuthProvider>
    </WalletProvider>
  );
};

export default () => (
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
