import React, { useState, useEffect } from "react";
import { FaCoins } from "react-icons/fa";
import "./styles.css";
import { Link } from "react-router-dom";
import LoginForm from "./login/LoginForm";

const Navbar = () => {
  const [modalLogin, setModalLogin] = useState(false);
  const [logged, setlogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setlogged(true);
    }
  }, []);

  const openLoginModal = (e) => {
    e.preventDefault();
    setModalLogin(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setlogged(false);
    window.location.href = "/coinfolio";
  };
  return (
    <>
      <div className="row mb-3">
        <div className="col-6">
          <Link to="/">
            <div className="navBar justify-content-start">
              <FaCoins className="icon" />
              <h1>
                Cripto<span className="purple">Folio</span>
              </h1>
            </div>
          </Link>
        </div>
        <div className="col-6 d-flex justify-content-end align-items-center">
          {!logged && (
            <span>
              <Link to="/" className="link" onClick={(e) => openLoginModal(e)}>
                Ingresar
              </Link>
            </span>
          )}
          {logged && (
            <span>
              <Link to="/" className="link" onClick={(e) => logout()}>
                Cerrar sesión
              </Link>
            </span>
          )}
        </div>
      </div>
      {modalLogin && <LoginForm setModalLogin={setModalLogin} />}
    </>
  );
};

export default Navbar;
