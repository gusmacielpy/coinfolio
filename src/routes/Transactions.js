import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TransactionsTable from "../components/transactions/TransactionsTable";
import HandleTransaction from "../components/transactions/HandleTransaction";
import Navbar from "../components/Navbar";
import TransactionsInfoCards from "../components/transactions/TransactionsInfoCards";
import { getQtty, getUser } from "../utils/functions";
import Spinner from "react-bootstrap/esm/Spinner";
import BreadcrumbBar from "../components/BreadcrumbBar";

const Transactions = ({ coins, setCoins, transactions, setTransactions }) => {
  const [coinData, setCoinData] = useState(null);
  const [newTransaction, setNewTransaction] = useState([]);
  const params = useParams();

  useEffect(() => {
    const gettingCoins = async () => {
      if (coins.length > 0) {
        setCoinData(...coins.filter((coin) => coin.id === params.coinId));
      } else {
        const user = getUser();
        try {
          await axios
            .get("https://app-criptofolio.herokuapp.com/api/coins/" + user)
            .then((res) => {
              setCoins(res.data);
            });
          await axios
            .get(
              "https://app-criptofolio.herokuapp.com/api/transactions/" + user
            )
            .then((res) => {
              setTransactions(res.data);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };
    gettingCoins();
  }, [coins, setCoinData, params.coinId, setCoins, setTransactions]);

  const handleNewTransaction = (idCoin, name, symbol, price) => {
    const quantity = getQtty(transactions, symbol);
    setNewTransaction({
      id: transactions.length + 1,
      idCoin,
      name,
      symbol,
      price,
      quantity,
      dateTime: "",
      type: "",
    });
  };
  return (
    <>
      <div>
        <div className="container">
          <Navbar />
          {coinData ? (
            <div>
              <BreadcrumbBar coin={coinData.name} />
              <div className="row">
                <div className="col-auto pe-1 m-0 align-middle d-flex align-items-center">
                  <div>
                    <img
                      src={coinData.thumb ? coinData.thumb : coinData.image}
                      alt={coinData.name}
                      style={{ width: "25px", height: "25px" }}
                    />
                  </div>
                </div>
                <div className="col-auto ml-auto d-flex align-items-center p-0 m-0 h4">
                  <div>{coinData.name}</div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-auto ml-auto d-flex align-items-center pe-1 h4">
                  <div style={{ color: "#CCCCCC" }}>
                    {coinData.current_price}$
                  </div>
                </div>
                <div className="col-auto ml-auto d-flex align-items-center ps-1 h4">
                  <div>
                    <label
                      style={{
                        color: `${
                          coinData.change_24h < 0 ? "#E15241" : "#8DC647"
                        }`,
                      }}
                    >
                      {coinData.change_24h}%
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Spinner
              animation="border"
              variant="light"
              role="status"
              size="sm"
            />
          )}
          <div className="row align-items-center g-3 justify-content-between mb-3">
            <TransactionsInfoCards
              coinData={coinData}
              transactions={transactions}
            />

            <div className="col-sm-3 text-end">
              <button
                className="openModalBtn"
                onClick={() =>
                  handleNewTransaction(
                    coinData.id,
                    coinData.name,
                    coinData.symbol,
                    coinData.current_price
                  )
                }
              >
                Agregar Transacción
              </button>
            </div>
          </div>
          <TransactionsTable
            coinId={params.coinId}
            coins={coins}
            transactions={transactions}
            setTransactions={setTransactions}
          />
        </div>
      </div>
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

export default Transactions;
