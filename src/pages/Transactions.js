import React from "react";
import TransactionsTable from "../components/transactions/TransactionsTable";
import Navbar from "../components/common/Navbar";
import TransactionsInfoCards from "../components/transactions/TransactionsInfoCards";
import { useAppContext } from "../context/AppContext";

const Transactions = () => {
  const { coins, transactions, user } = useAppContext();

  return (
    <div>
      <Navbar user={user} />
      <div className="container mt-4">
        <h1>Transacciones</h1>
        <TransactionsInfoCards coins={coins} transactions={transactions} />
        <TransactionsTable coins={coins} transactions={transactions} />
      </div>
    </div>
  );
};

export default Transactions;
