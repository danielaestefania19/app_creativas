import React, { useState, useEffect, createContext } from 'react';


const Modal = ({ children, show, onClose }) => {
    if (!show) {
      return null;
    }
  
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow-md">
          {children}
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    );
  };
  
  export default Modal