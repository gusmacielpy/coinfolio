import React from "react";
import { useState, useEffect } from "react";
import { getQtty, toFix2 } from "../../utils/functions";

const HoldingCoins = ({ coin, transactions }) => {
  const [holdingCoin, setHoldingCoin] = useState([]);

  useEffect(() => {
    const quantity = getQtty(transactions, coin.symbol);
    setHoldingCoin({
      quantity,
      holding: quantity * parseFloat(coin.current_price),
    });
  }, [transactions, coin]);

  return (
    <div style={{ color: "#A5A5A5" }}>
      <div>
        {holdingCoin.holding ? toFix2(holdingCoin.holding.toString()) : 0}$
      </div>
      <div>
        {holdingCoin.quantity ? holdingCoin.quantity : 0}&nbsp;
        {coin.symbol.toUpperCase()}
      </div>
    </div>
  );
};

export default HoldingCoins;
