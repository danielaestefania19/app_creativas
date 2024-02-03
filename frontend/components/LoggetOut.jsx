import React, { useContext } from "react"; 
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from './AuthContext.jsx';

function LoggedOut() {
  const { login, lastVisitedRoute } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate(lastVisitedRoute); 
  };

  return (
    <div className="container">
      <h1>Login With Internet Identity</h1>
      <h2>You haven't logged in yet!</h2>
      <p>To log in, click this button!</p>
      <button type="button" id="loginButton" onClick={handleLogin}>
        Log in
      </button>
    </div>
  );
}

export default LoggedOut;
