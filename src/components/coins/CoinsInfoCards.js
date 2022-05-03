import React, { useState, useEffect } from "react";
import {
  getTotalBalance,
  getPortolioChange24,
  getTotalPNL,
} from "../../utils/functions";
import InfoCards from "../InfoCards";

const CoinsInfoCards = ({ coins, transactions }) => {
  const [infoCoins, setInfoCoins] = useState([]);

  useEffect(() => {
    const totalBalance = getTotalBalance(coins, transactions);
    const portfolioChange24 = getPortolioChange24(coins, transactions);
    const totalPNL = getTotalPNL(coins, transactions);
    setInfoCoins([
      {
        value: { inNumber: `${totalBalance}$`, inPct: "" },
        subTitle: "Balance total",
      },
      {
        value: {
          inNumber: `${portfolioChange24.inNumber}$`,
          inPct: portfolioChange24.inPct,
        },
        subTitle: "Cambios en 24h",
      },
      {
        value: {
          inNumber: `${totalPNL.inNumber}$`,
          inPct: totalPNL.inPct,
        },
        subTitle: "Total Ganancias/Pérdidas",
      },
    ]);
  }, [transactions, coins]);

  return <InfoCards infoCards={infoCoins} />;
};

export default CoinsInfoCards;
