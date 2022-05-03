import React, { useState, useEffect } from "react";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";
import { getUser } from "../../utils/functions";

const HandleTransactionForm = ({
  handleTransaction,
  handleClose,
  transactions,
  setTransactions,
  formType,
  action,
}) => {
  const [price, setPrice] = useState(handleTransaction.price);
  const [quantity, setQuantity] = useState(
    action === "edit" ? handleTransaction.quantity : ""
  );
  const [dateTime, setDateTime] = useState(handleTransaction.dateTime);
  const [transfType, setTransfType] = useState("");

  useEffect(() => {
    setDateTime(dateTime === "" ? new Date() : dateTime);
  }, [dateTime]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = getUser();
    const formTransaction = {
      user,
      ...handleTransaction,
      price,
      quantity,
      dateTime,
      type:
        transfType !== ""
          ? transfType
          : handleTransaction.type !== ""
          ? handleTransaction.type
          : formType,
    };
    if (action === "new") {
      saveTransaction(formTransaction);
      await setTransactions([...transactions, formTransaction]);
    }
    if (action === "edit") {
      const updatedTransactions = transactions.map((transaction) =>
        transaction.id === handleTransaction.id
          ? formTransaction
          : { ...transaction }
      );
      await setTransactions(updatedTransactions);
      await updateTransaction(formTransaction);
    }
    await handleClose();
  };

  const saveTransaction = async (data) => {
    try {
      await axios
        .post("https://app-criptofolio.herokuapp.com/api/transactions", {
          data,
        })
        .then((res) => console.log(res));
    } catch (error) {
      console.log(error);
    }
  };

  const updateTransaction = async (data) => {
    try {
      await axios.put(
        "https://app-criptofolio.herokuapp.com/api/transactions/" +
          handleTransaction.id +
          "/&",
        data
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="needs-validation mt-2" onSubmit={onSubmit}>
      {formType === "transfer" && (
        <div className="mb-3">
          <label htmlFor="tipoTransferencia">Tipo de Transferencia</label>
          <div className="form-check form-check-inline ms-4">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio1"
              onClick={() => setTransfType("transf entrante")}
              value="transf entrante"
              defaultChecked={
                handleTransaction.type === "transf entrante" ? true : null
              }
              required
            />
            <label className="form-check-label" htmlFor="inlineRadio1">
              Entrante
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio2"
              onClick={() => setTransfType("transf saliente")}
              value="transf saliente"
              defaultChecked={
                handleTransaction.type === "transf saliente" ? true : null
              }
              required
            />
            <label className="form-check-label" htmlFor="inlineRadio2">
              Saliente
            </label>
          </div>
        </div>
      )}
      {formType !== "transfer" && (
        <div className="mb-3">
          <label className="control-label" htmlFor="precioPorMoneda">
            Precio por moneda (USD)
          </label>
          <input
            type="number"
            defaultValue={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
            id="precioPorMoneda"
            step="any"
            required
          />
        </div>
      )}
      {(formType === "venta" || formType === "transfer") && (
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <label htmlFor="cantidadMonedas" className="control-label">
              Cantidad
            </label>
            {formType !== "transfer" && (
              <label htmlFor="totalMonedas">
                {`Balance: ${
                  handleTransaction.quantity
                }${handleTransaction.symbol.toUpperCase()}`}
              </label>
            )}
          </div>

          <div className="input-group">
            <span className="input-group-text" id="inputGroupPrepend">
              {handleTransaction.symbol.toUpperCase()}
            </span>
            <input
              type="number"
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity}
              className="form-control rounded-0"
              id="cantidadMonedas"
              aria-describedby="inputGroupPrepend"
              step="any"
              required
            />
            {formType !== "transfer" && (
              <span
                className="input-group-text p-1 bg-white"
                id="inputGroupPrepend"
              >
                <button
                  type="button"
                  onClick={() => setQuantity(handleTransaction.quantity)}
                  className="btn btn-success btn-sm"
                >
                  MAX
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {formType === "compra" && (
        <div className="mb-3">
          <label htmlFor="cantidadMonedas" className="control-label">
            Cantidad
          </label>
          <div className="input-group">
            <span className="input-group-text" id="inputGroupPrependTxt">
              {handleTransaction.symbol.toUpperCase()}
            </span>
            <input
              type="number"
              onChange={(e) => setQuantity(e.target.value)}
              defaultValue={action === "edit" ? quantity : null}
              className="form-control"
              id="cantidadMonedas"
              aria-describedby="inputGroupPrepend"
              step="any"
              required
            />
          </div>
        </div>
      )}
      {formType !== "transfer" && (
        <div className="mb-3">
          <label htmlFor="totalTransaccion">
            {formType === "compra" ? "Total gastado" : "Total recibido"}
          </label>
          <input
            type="text"
            className="form-control"
            id="totalTransaccion"
            value={price * quantity}
            disabled
          />
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="fecha" className="control-label">
          Fecha
        </label>
        <DateTimePicker
          id="fecha"
          onChange={setDateTime}
          value={action === "edit" ? new Date(dateTime) : dateTime}
          className={"react-calendar"}
          required
        />
      </div>
      <div className="text-center mt-2 mb-2">
        <button
          type="button"
          className="btn btn-secondary me-3"
          onClick={handleClose}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Registrar
        </button>
      </div>
    </form>
  );
};

export default HandleTransactionForm;
