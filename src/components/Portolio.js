import React, { useState, useEffect } from "react";
import axios from "axios";
import CoinSearching from "./coins/CoinSearching";
import CoinsTable from "./coins/CoinsTable";
import Navbar from "./Navbar";
import CoinsInfoCards from "./coins/CoinsInfoCards";
import Unlogged from "../assets/unlogged";
import { Link } from "react-router-dom";
import LoginForm from "./login/LoginForm";
import Spinner from "react-bootstrap/esm/Spinner";
import { getUser } from "../utils/functions";
import HandleTransaction from "./transactions/HandleTransaction";

const Portolio = ({ coins, setCoins, transactions, setTransactions }) => {
  const [modalSearch, setModalSearch] = useState(false);
  const [logged, setlogged] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newTransaction, setNewTransaction] = useState([]);

  useEffect(() => {
    const getDataFromSvr = async () => {
      try {
        const user = getUser();
        await axios
          .get("https://app-criptofolio.herokuapp.com/api/coins/" + user)
          .then((res) => setCoins(res.data));
        await axios
          .get("https://app-criptofolio.herokuapp.com/api/transactions/" + user)
          .then((res) => setTransactions(res.data));
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      setlogged(true);
      getDataFromSvr();
    } else {
      setCoins([]);
      setLoading(false);
    }
  }, []);

  const openLoginModal = (e) => {
    e.preventDefault();
    setModalLogin(true);
  };

  const handleNewTransaction = (idCoin, name, symbol, price) => {
    setNewTransaction({
      idCoin,
      name,
      symbol,
      price,
      quantity: 0,
      dateTime: "",
      type: "",
    });
  };
  return (
    <>
      <div className="App">
        <div className="container">
          <Navbar />
          <div className="row align-items-center g-3 justify-content-between mb-3">
            <CoinsInfoCards coins={coins} transactions={transactions} />

            <div className="col-sm-3 text-end">
              {logged && (
                <button
                  className="openModalBtn"
                  onClick={() => setModalSearch(true)}
                >
                  Agregar Criptomoneda
                </button>
              )}
            </div>
          </div>
          {modalSearch && (
            <CoinSearching
              modalSearch={modalSearch}
              setModalSearch={setModalSearch}
              coins={coins}
              setCoins={setCoins}
              handleNewTransaction={handleNewTransaction}
            />
          )}
          <div className="row">
            <div className="col">
              {!loading && coins.length !== 0 && (
                <CoinsTable
                  coins={coins}
                  setCoins={setCoins}
                  setTransactions={setTransactions}
                  transactions={transactions}
                />
              )}
              {!loading && logged && !coins.length && (
                <div className="mt-5 mb-5 d-flex justify-content-center aligns-items-center">
                  <span className="infoTxt">
                    No tienes ninguna criptomoneda aun
                  </span>
                </div>
              )}
              {!loading && !logged && (
                <div className="row d-flex aligns-items-center justify-content-center mt-5 mb-5">
                  <div style={{ width: "18rem" }}>
                    <Unlogged />
                  </div>
                  <div className="row d-flex aligns-items-center justify-content-center ms-2">
                    <div className="d-flex aligns-items-center justify-content-center">
                      <span className="infoTxt">
                        Ingresa para gestionar tu portfolio
                      </span>
                    </div>
                    <div className="d-flex aligns-items-center justify-content-center">
                      <span className="infoTxtSmaller">
                        usuario: test@test.com contraseña: 12345
                      </span>
                    </div>
                    <div className="d-flex aligns-items-center justify-content-center">
                      <span className="infoTxt">
                        <Link
                          to="/"
                          className="link"
                          onClick={(e) => openLoginModal(e)}
                        >
                          Ingresar
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {loading && (
                <div className="mt-5 d-flex justify-content-center aligns-items-center">
                  <Spinner
                    animation="border"
                    variant="light"
                    role="status"
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>
          <footer className="footer bg-warning m-0 p-0">
            <div
              className="text-center p-3"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            >
              © 2022 Copyright:&nbsp;
              <a href="https://github.com/eggodev">eggodev</a>
            </div>
          </footer>
        </div>
      </div>
      {modalLogin && <LoginForm setModalLogin={setModalLogin} />}
      {newTransaction.name && (
        <HandleTransaction
          setHandleTransaction={setNewTransaction}
          handleTransaction={newTransaction}
          setTransactions={setTransactions}
          transactions={transactions}
          action={"new"}
        />
      )}
    </>
  );
};

export default Portolio;
