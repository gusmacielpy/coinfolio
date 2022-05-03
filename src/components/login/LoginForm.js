import React, { useState } from "react";
import axios from "axios";
import { Modal, Tabs, Tab } from "react-bootstrap";
import CloseButton from "react-bootstrap/esm/CloseButton";

const LoginForm = ({ setModalLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitRegister = async (e) => {
    await handleClose();
    e.preventDefault();
    try {
      await axios
        .post("https://app-criptofolio.herokuapp.com/api/users", {
          email,
          password,
        })
        .then((res) => {
          if (res.data.message) {
            alert(
              "Registrado exitosamente! Ahora puedes ingresar con tus datos"
            );
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const submitLogin = async (e) => {
    await handleClose();
    e.preventDefault();
    try {
      await axios
        .post("https://app-criptofolio.herokuapp.com/api/users/login", {
          email,
          password,
        })
        .then((res) => {
          if (res.data.user) {
            localStorage.setItem("token", res.data.user);
            window.location.href = "/coinfolio";
          } else {
            alert("Por favor verifica tu usuario y contraseña...");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setModalLogin(false);
  };
  return (
    <Modal show={true} animation={false} onHide={handleClose}>
      <Modal.Header className="bg-dark border-0 pb-0">
        <CloseButton variant="white" onClick={handleClose} />
      </Modal.Header>
      <Modal.Body className="bg-dark">
        <Tabs
          defaultActiveKey="login"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="login" title="Ingresar">
            <form className="needs-validation mt-2" onSubmit={submitLogin}>
              <div className="mb-3">
                <label className="control-label" htmlFor="emailLog">
                  Email
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  id="emailLog"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="control-label" htmlFor="passLog">
                  Contraseña
                </label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  id="passLog"
                  required
                />
              </div>

              <div className="text-center mt-2 mb-2">
                <button
                  type="button"
                  className="btn btn-secondary me-3"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Ingresar
                </button>
              </div>
            </form>
          </Tab>
          <Tab eventKey="registro" title="Registro">
            <form className="needs-validation mt-2" onSubmit={submitRegister}>
              <div className="mb-3">
                <label className="control-label" htmlFor="emailReg">
                  Email
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  id="emailReg"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="control-label" htmlFor="passReg">
                  Contraseña
                </label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  id="passReg"
                  required
                />
              </div>

              <div className="text-center mt-2 mb-2">
                <button
                  type="button"
                  className="btn btn-secondary me-3"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Registrar
                </button>
              </div>
            </form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default LoginForm;
