import React, { useState, useEffect } from "react";
import axios from "axios";
import CoinSearching from "../components/coins/CoinSearching";
import CoinsTable from "../components/coins/CoinsTable";
import Navbar from "../components/common/Navbar";
import CoinsInfoCards from "../components/coins/CoinsInfoCards";
import Unlogged from "../assets/unlogged";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import Spinner from "react-bootstrap/esm/Spinner";
import { getUser } from "../utils/functions";
import HandleTransaction from "../components/transactions/HandleTransaction";

const Portfolio = ({ coins, setCoins, transactions, setTransactions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoins, setFilteredCoins] = useState(coins);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await axios(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
        );
        setCoins(result.data);
        setFilteredCoins(result.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [setCoins]);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === "") {
      setFilteredCoins(coins);
    } else {
      const filtered = coins.filter((coin) =>
        coin.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCoins(filtered);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleTransactionComplete = (transactionData) => {
    setTransactions((prev) => [...prev, transactionData]);
  };

  return (
    <div>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(true)}
      />
      <div className="container mt-4">
        <h1>Portfolio</h1>
        <CoinSearching searchTerm={searchTerm} onSearch={handleSearch} />
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <CoinsTable coins={filteredCoins} />
        )}
        <CoinsInfoCards coins={filteredCoins} />
        {user ? (
          <HandleTransaction
            transactions={transactions}
            onComplete={handleTransactionComplete}
          />
        ) : (
          <div className="alert alert-info">
            Please log in to view your transaction history.
          </div>
        )}
      </div>
      {showLogin && (
        <LoginForm
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
};

export default Portfolio;
