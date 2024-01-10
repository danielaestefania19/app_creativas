import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home.jsx';
import Body from './components/Body.jsx';
import './styles/styles.css'
import Shop from "./components/Shop.jsx"
import PaymentDetails from "./components/PaymentDetails.jsx";
import PaymentButton from "./components/Pay.jsx"
import { ChakraProvider } from "@chakra-ui/react";



function App() {
  const navigate = useNavigate();

  const handleCreatePayment = () => {
    navigate('/other/shop');
  };

  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Home/>} />
        <Route path="/other/shop" element={<Shop />} />
        <Route path="/status" element={<PaymentDetails />} />
        <Route path="/pay" element={<PaymentButton />} />
      </Routes>
      <Body onCreatePayment={handleCreatePayment} />
    </div>
  );
}

export default () => (
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
