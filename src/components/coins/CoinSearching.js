import React, { useState, useEffect } from "react";
import axios from "axios";
import fromExponential from "from-exponential";
import CoinRow from "./CoinRow";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/esm/Spinner";
import CloseButton from "react-bootstrap/esm/CloseButton";
import { roundToTwo, getUser, filterItems } from "../../utils/functions";

const user = getUser();

const CoinSearching = ({
  modalSearch,
  setModalSearch,
  coins,
  setCoins,
  handleNewTransaction,
}) => {
  const [tenCoins, setTenCoins] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const handleClose = () => setModalSearch(false);

  useEffect(() => {
    const getTenCoins = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        setTenCoins(res.data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
      }
    };
    getTenCoins();
  }, []);

  useEffect(() => {
    if (!modalSearch) setSearchResult([]);
  }, [modalSearch]);

  const handleNewCoin = async (newCoin) => {
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${newCoin}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
      );
      if (res.data.id) {
        const newCoin = {
          user,
          id: res.data.id,
          name: res.data.name,
          symbol: res.data.symbol,
          image: res.data.image.thumb,
          current_price: parseFloat(
            fromExponential(res.data.market_data.current_price.usd)
          ),
          change_1h: roundToTwo(
            res.data.market_data.price_change_percentage_1h_in_currency.usd
          ),
          change_24h: roundToTwo(
            res.data.market_data.price_change_percentage_24h_in_currency.usd
          ),
          change_7d: roundToTwo(
            res.data.market_data.price_change_percentage_7d_in_currency.usd
          ),
          sparkline_7d: res.data.market_data.sparkline_7d.price,
        };

        const existAlready = filterItems(coins, {
          user: user,
          symbol: newCoin.symbol,
        });
        if (existAlready.length === 0) {
          saveCoin(newCoin);
          setCoins([...coins, newCoin]);
        } else {
          handleNewTransaction(
            existAlready[0].id,
            existAlready[0].name,
            existAlready[0].symbol,
            existAlready[0].current_price
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveCoin = async (data) => {
    try {
      await axios.post("https://app-criptofolio.herokuapp.com/api/coins", {
        data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const searching = async (req) => {
    setIsSearching(true);
    if (req) {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/search?query=${req}`
        );
        setSearchResult(res.data.coins);
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsSearching(false);
    }
  };
  const coinsList = isSearching
    ? searchResult.length
      ? searchResult
      : null
    : tenCoins;
  return (
    <Modal show={true} onHide={handleClose} animation={false}>
      <Modal.Header className="bg-dark border-0 pb-0">
        <Modal.Title>
          <h5 className="modal-title">Busca tu criptomoneda</h5>
        </Modal.Title>
        <CloseButton variant="white" onClick={handleClose} />
      </Modal.Header>
      <Modal.Body className="bg-dark">
        <input
          type="text"
          placeholder="Escribe el nombre de la criptomoneda"
          className="form-control border-0 text-center mb-2"
          onChange={(e) => searching(e.target.value)}
          autoFocus
        />
        {isLoading && !isError && (
          <div className="text-center mb-0">
            <Spinner
              animation="border"
              variant="light"
              role="status"
              size="sm"
            />
          </div>
        )}
        {isError && (
          <div className="text-center mb-0">
            <span className="text-danger">
              Ocurrió algun error. Cuenta con señal de internet?
            </span>
          </div>
        )}
        {coinsList && (
          <table className="table table-dark mt-0 mb-0 table-hover table-bordered">
            <tbody>
              {coinsList.map((coin, index) => (
                <CoinRow
                  coin={coin}
                  key={index}
                  index={index}
                  handleNewCoin={handleNewCoin}
                  handleClose={handleClose}
                />
              ))}
            </tbody>
          </table>
        )}
        {!coinsList && <span>Ningún resultado encontrado</span>}
      </Modal.Body>
    </Modal>
  );
};

export default CoinSearching;
