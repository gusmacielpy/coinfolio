import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { getUser } from "../utils/functions";

const AppContext = createContext();

const initialState = {
  user: null,
  coins: [],
  transactions: [],
  loading: false,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_COINS":
      return { ...state, coins: action.payload };
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const userData = getUser();
    dispatch({ type: "SET_USER", payload: userData });
    if (userData) {
      fetchCoins();
      fetchTransactions();
    }
  }, []);

  const fetchCoins = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await axios("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd");
      dispatch({ type: "SET_COINS", payload: result.data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const fetchTransactions = async () => {
    // Aquí iría el fetch real de transacciones del usuario
    dispatch({ type: "SET_TRANSACTIONS", payload: [] });
  };

  return (
    <AppContext.Provider value={{ ...state, dispatch, fetchCoins, fetchTransactions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
