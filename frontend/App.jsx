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
import SetItem from "./components/Providers/Set_items.jsx"


function App() {
  const navigate = useNavigate();

  const handleCreatePayment = () => {
    navigate('/other/shop');
  };

  return (
    <div className="App">
      <Home/>
      <Routes>
        <Route path="/" element={<Body onCreatePayment={handleCreatePayment} />} />
        <Route path="/other/shop" element={<Shop />} />
        <Route path="/status" element={<PaymentDetails />} />
        <Route path="/pay" element={<PaymentButton />} />
      </Routes>
    </div>
  );
};

export default () => (
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
