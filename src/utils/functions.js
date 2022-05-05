import jwt_decode from "jwt-decode";

export function excludeItems(array, filter) {
  const items = array.filter(function (item) {
    for (var key in filter) {
      if (item[key] === undefined || item[key] !== filter[key]) return true;
    }
    return false;
  });
  return items;
}

export function filterItems(array, filter) {
  const items = array.filter(function (item) {
    for (var key in filter) {
      if (item[key] === undefined || item[key] !== filter[key]) return false;
    }
    return true;
  });
  return items;
}

export function getQtty(transactions, symbol, user) {
  const coinTransactions = filterItems(transactions, {
    user: user,
    symbol: symbol,
  });

  let quantity = 0;
  coinTransactions.forEach((coin) => {
    if (coin.type === "compra" || coin.type === "transf entrante") {
      quantity += parseFloat(coin.quantity);
    } else {
      quantity -= parseFloat(coin.quantity);
    }
  });
  return quantity;
}

export function roundToTwo(num) {
  return +(Math.round(num + "e+1") + "e-1");
}

export function toFix2(n) {
  let number = n.replace(/(-?)(\d+)\.(\d\d)(\d+)/, (_, s, i, d, r) => {
    let k = (+r[0] >= 5) + +d - (r === 5 && s === "-");
    return s + (+i + (k > 99)) + "." + (k > 99 ? "00" : k > 9 ? k : "0" + k);
  });
  return number;
}

export function getTransactionPNL(coin, transaction) {
  let transactionPNL = 0;
  if (transaction.type === "compra" || transaction.type === "venta") {
    transactionPNL =
      (coin.current_price - transaction.price) * transaction.quantity;
  }
  if (
    transaction.type === "transf entrante" ||
    transaction.type === "transf saliente"
  ) {
    transactionPNL = transaction.price * transaction.quantity;
  }
  return transactionPNL;
}

export function getTotalBalance(coins, transactions) {
  let totalBalance = 0;
  if (transactions.length > 0) {
    transactions.map((transaction) => {
      const coin = coins.find((coin) => coin.symbol === transaction.symbol);
      if (
        transaction.type === "compra" ||
        transaction.type === "transf entrante"
      ) {
        totalBalance +=
          parseFloat(transaction.quantity) * parseFloat(coin.current_price);
      } else {
        totalBalance -=
          parseFloat(transaction.quantity) * parseFloat(coin.current_price);
      }
      return totalBalance;
    });
  }
  return toFix2(totalBalance.toString());
}

export function getPortolioChange24(coins, transactions) {
  let totalBalance24h = 0;
  let result = { inNumber: 0, inPct: 0 };
  if (transactions.length > 0) {
    transactions.map((transaction) => {
      const coin = coins.find((coin) => coin.symbol === transaction.symbol);

      if (
        transaction.type === "compra" ||
        transaction.type === "transf entrante"
      ) {
        totalBalance24h +=
          parseFloat(transaction.quantity) *
          (parseFloat(coin.current_price) * (coin.change_24h / 100));
      } else {
        totalBalance24h -=
          parseFloat(transaction.quantity) *
          (parseFloat(coin.current_price) * (coin.change_24h / 100));
      }
      return totalBalance24h;
    });
    const totalBalance = getTotalBalance(coins, transactions);
    const pctVariation =
      totalBalance24h !== 0 && totalBalance !== 0
        ? (totalBalance24h * 100) / totalBalance
        : 0;

    result = {
      inNumber: toFix2(totalBalance24h.toString()),
      inPct: toFix2(pctVariation.toString()),
    };
  }
  return result;
}

export function getTotalPNL(coins, transactions) {
  let totalPNL = 0;
  let totalCost = 0;
  let result = { inNumber: 0, inPct: 0 };
  if (transactions.length > 0) {
    transactions.map((transaction) => {
      const coin = coins.find((coin) => coin.symbol === transaction.symbol);

      if (transaction.type === "compra") {
        totalPNL +=
          (coin.current_price - transaction.price) * transaction.quantity;
      }
      if (transaction.type === "venta") {
        totalPNL -=
          (coin.current_price - transaction.price) * transaction.quantity;
      }
      if (transaction.type === "transf entrante") {
        totalPNL += transaction.price * transaction.quantity;
      }
      if (transaction.type === "transf saliente") {
        totalPNL -= transaction.price * transaction.quantity;
      }
      return null;
    });
    totalCost += getTotalCost(transactions);
    const pctVariation = totalCost > 0 ? (totalPNL * 100) / totalCost : 0;

    result = {
      inNumber: toFix2(totalPNL.toString()),
      inPct: toFix2(pctVariation.toString()),
    };
  }
  return result;
}

export function getCoinPNL(coin, transactions) {
  let totalPNL = 0;
  let result = { inNumber: 0, inPct: 0 };
  if (transactions.length > 0) {
    const filteredTransactions = transactions.filter(
      (transaction) => transaction.idCoin === coin.id
    );
    filteredTransactions.map((transaction) => {
      if (transaction.type === "compra") {
        totalPNL +=
          (coin.current_price - transaction.price) * transaction.quantity;
      }
      if (transaction.type === "venta") {
        totalPNL -=
          (coin.current_price - transaction.price) * transaction.quantity;
      }

      if (transaction.type === "transf entrante") {
        totalPNL += transaction.price * transaction.quantity;
      }
      if (transaction.type === "transf saliente") {
        totalPNL -= transaction.price * transaction.quantity;
      }
      return null;
    });
    const totalCost = getCoinCost(transactions, coin.symbol);
    const pctVariation = totalCost > 0 ? (totalPNL * 100) / totalCost : 0;
    result = {
      inNumber: toFix2(totalPNL.toString()),
      inPct: toFix2(pctVariation.toString()),
    };
  }
  return result;
}

export function getTotalCost(transactions) {
  let totalCost = 0;
  let result = 0;
  if (transactions.length > 0) {
    transactions.map((transaction) => {
      if (transaction.type === "compra") {
        totalCost += transaction.price * transaction.quantity;
      }
      return totalCost;
    });
    result = totalCost;
  }
  return result;
}

export function getCoinCost(transactions, coin) {
  let totalCost = 0;
  let result = 0;
  if (transactions.length > 0) {
    const filteredTransactions = transactions.filter(
      (transaction) => transaction.symbol === coin
    );
    filteredTransactions.map((transaction) => {
      if (transaction.type === "compra") {
        totalCost += transaction.price * transaction.quantity;
      }
      return totalCost;
    });
    result = totalCost;
  }
  return result;
}

export function getUser() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  const user = jwt_decode(token);
  return user.email;
}
