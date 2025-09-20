import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/transactions" element={<Transactions />}>
          <Route path=":coinId" element={<Transactions />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
