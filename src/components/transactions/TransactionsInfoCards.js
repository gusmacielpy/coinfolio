import React, { useState, useEffect } from "react";
import {
  getQtty,
  toFix2,
  getCoinPNL,
  getCoinCost,
  getUser,
} from "../../utils/functions";
import InfoCards from "../InfoCards";

const user = getUser();

const TransactionsInfoCards = ({ coinData, transactions }) => {
  const [infoCoins, setInfoCoins] = useState([]);

  useEffect(() => {
    if (coinData) {
      const quantity = getQtty(transactions, coinData.symbol, user);
      const totalCost = getCoinCost(transactions, coinData.symbol);
      const totalPNL = getCoinPNL(coinData, transactions);

      setInfoCoins([
        {
          value: {
            inNumber: `${toFix2(
              (quantity * parseFloat(coinData.current_price)).toString()
            )}$`,
            inPct: "",
          },
          subTitle: "Valor del activo",
        },
        {
          value: {
            inNumber: quantity,
            inPct: "",
          },
          subTitle: "Cantidad",
        },
        {
          value: {
            inNumber: `${toFix2(totalCost.toString())}$`,
            inPct: "",
          },
          subTitle: "Costo Total",
        },
        {
          value: {
            inNumber: `${totalPNL.inNumber}$`,
            inPct: totalPNL.inPct,
          },
          subTitle: "Total Ganancias/Pérdidas",
        },
      ]);
    }
  }, [transactions, coinData]);

  return <InfoCards infoCards={infoCoins} />;
};

export default TransactionsInfoCards;
