import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home.jsx';
import './styles/styles.css'
import Shop from "./components/Shop.jsx"
import PaymentDetails from "./components/PaymentDetails.jsx";
import PaymentButton from "./components/Pay.jsx"
import { ChakraProvider } from "@chakra-ui/react";
import  GetBillingAddressButton from "./components/GetStatus.jsx"


function App() {
  const navigate = useNavigate();

  const handleCreatePayment = () => {
    navigate('/other/shop');
  };
  const seestatus = () => {
    navigate('pay');
  };


  return (
    <div className="App">
      <div>
        <div className="bar">
          <Link to="/" className="link">Home</Link>
          <a href="/about" className="link">About</a>
          <a href="/contact" className="link">Contact</a>
        </div>
        <button onClick={handleCreatePayment} className='create-pay'>Ir a la Tienda</button>
        {/* <button onClick={seestatus} className='create-pay'>Ver detalles</button> */}
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/other/shop" element={<Shop />} />
        <Route path="/status" element={<PaymentDetails />} />
        <Route path="/pay" element={<PaymentButton />} />
      </Routes>

    </div>
  );
}

export default () => (
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
