import React, { useContext } from "react"; // Importa useContext aquí
import { useNavigate } from 'react-router-dom'; // Importa useNavigate aquí
import { AuthContext } from './AuthContext.jsx';

function LoggedOut() {
  const { login, lastVisitedRoute } = useContext(AuthContext); // Usa useContext aquí
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate(lastVisitedRoute); // Navega a la última ruta visitada después de iniciar sesión
  };

  return (
    <div className="container">
      <h1>Login Con Interner Identity</h1>
      <h2>No has iniciado sesion todavia!</h2>
      <p>Para uniciar sesion dale click a este boton!</p>
      <button type="button" id="loginButton" onClick={handleLogin}>
        Log in
      </button>
    </div>
  );
}

export default LoggedOut;
