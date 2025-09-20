import axios from "axios";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const APP_BASE_URL = "https://app-criptofolio.herokuapp.com/api";

export const coinsService = {
  getMarketCoins: async () => {
    const response = await axios.get(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd`
    );
    return response.data;
  },
  getUserCoins: async (user) => {
    const response = await axios.get(`${APP_BASE_URL}/coins/${user}`);
    return response.data;
  },
  saveCoin: async (data) => {
    const response = await axios.post(`${APP_BASE_URL}/coins`, data);
    return response.data;
  },
  deleteCoin: async (user, symbol) => {
    const response = await axios.delete(`${APP_BASE_URL}/coins/${user}/${symbol}`);
    return response.data;
  },
};

export const transactionsService = {
  getUserTransactions: async (user) => {
    const response = await axios.get(`${APP_BASE_URL}/transactions/${user}`);
    return response.data;
  },
  saveTransaction: async (data) => {
    const response = await axios.post(`${APP_BASE_URL}/transactions`, data);
    return response.data;
  },
  updateTransaction: async (user, transactionId, data) => {
    const response = await axios.put(`${APP_BASE_URL}/transactions/${user}/${transactionId}`, data);
    return response.data;
  },
  deleteTransaction: async (user, transactionId) => {
    const response = await axios.delete(`${APP_BASE_URL}/transactions/deletetransaction/${user}/${transactionId}`);
    return response.data;
  },
  deleteTransactionsByCoin: async (user, symbol) => {
    const response = await axios.delete(`${APP_BASE_URL}/transactions/deletetransactions/${user}/${symbol}`);
    return response.data;
  },
};
