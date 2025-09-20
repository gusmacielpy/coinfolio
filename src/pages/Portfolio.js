import React, { useState } from "react";
import CoinSearching from "../components/coins/CoinSearching";
import CoinsTable from "../components/coins/CoinsTable";
import Navbar from "../components/common/Navbar";
import CoinsInfoCards from "../components/coins/CoinsInfoCards";
import LoginForm from "../components/auth/LoginForm";
import Spinner from "react-bootstrap/esm/Spinner";
import HandleTransaction from "../components/transactions/HandleTransaction";
import { useAppContext } from "../context/AppContext";

const Portfolio = () => {
  const {
    user,
    coins,
    transactions,
    loading,
    fetchCoins,
    fetchTransactions,
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoins, setFilteredCoins] = useState(coins);
  const [showLogin, setShowLogin] = useState(false);

  React.useEffect(() => {
    setFilteredCoins(coins);
  }, [coins]);

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
    setShowLogin(false);
  };

  const handleLogout = () => {};

  const handleTransactionComplete = (transactionData) => {};

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
