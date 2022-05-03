import React from "react";

const CoinRow = ({ coin, handleNewCoin, handleClose }) => {
  const handleCoinSelected = () => {
    handleNewCoin(coin.id);
    handleClose();
  };

  return (
    <tr onClick={() => handleCoinSelected()}>
      <td className="px-4">
        <img
          src={coin.thumb ? coin.thumb : coin.image}
          alt={coin.name}
          className="me-3"
          style={{ width: "18px", height: "18px" }}
        />
        <span>{coin.name}</span>
        <span className="ms-2 text-muted">{coin.symbol}</span>
      </td>
    </tr>
  );
};

export default CoinRow;
