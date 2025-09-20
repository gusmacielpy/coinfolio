import React, { createContext, useContext, useReducer, useEffect } from "react";
import { getUser } from "../utils/functions";
import { coinsService, transactionsService } from "../services/api";

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
    fetchCoins();
    if (userData) fetchTransactions(userData);
  }, []);

  const fetchCoins = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const coins = await coinsService.getMarketCoins();
      dispatch({ type: "SET_COINS", payload: coins });
      clearError();
    } catch (error) {
      setError(error.message);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const fetchTransactions = async (user) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const transactions = await transactionsService.getUserTransactions(user);
      dispatch({ type: "SET_TRANSACTIONS", payload: transactions });
      clearError();
    } catch (error) {
      setError(error.message);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  };

  const setError = (message) => {
    dispatch({ type: "SET_ERROR", payload: message });
  };

  const clearError = () => {
    dispatch({ type: "SET_ERROR", payload: null });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        dispatch,
        fetchCoins,
        fetchTransactions,
        setError,
        clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
