import React from "react";
import { useNavigate } from "react-router-dom";


const Cart = ({ cart, removeFromCart, onHideCart }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Aquí puedes implementar la lógica para proceder al pago o finalizar la compra
    // Por ahora, simplemente redirigiremos a la página de pago
    navigate("/pay");
  };

  return (
    <div className="fixed top-0 right-0 h-full w-1/3 bg-white border-l border-gray-300 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Carrito de Compras</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={onHideCart}
        >
          Ocultar
        </button>
      </div>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="mb-4">
              <p className="text-lg font-bold">{item.name}</p>
              <p className="text-gray-600">{item.item}</p>
              <p className="text-blue-600">${item.price}</p>
              <div className="flex items-center">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFromCart(index)}
                >
                  Eliminar
                </button>
                <span className="mx-2">{item.quantity}</span> {/* Contador */}
              </div>
            </div>
          ))}
          <button
            className="bg-[#c9398a] text-white px-4 py-2 rounded-md mt-4"
            onClick={handleCheckout}
          >
            Pagar
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
