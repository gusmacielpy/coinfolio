import "./App.css";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Portolio from "./components/Portolio";
import Transactions from "./routes/Transactions";

function App() {
  const [coins, setCoins] = useState([]);
  const [transactions, setTransactions] = useState([]);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Portolio
              coins={coins}
              setCoins={setCoins}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />

        <Route
          path="/transactions"
          element={
            <Transactions
              coins={coins}
              setCoins={setCoins}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        >
          <Route path=":coinId" element={<Transactions />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
