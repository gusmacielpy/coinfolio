import React from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import CloseButton from "react-bootstrap/esm/CloseButton";
import { getUser, excludeItems } from "../../utils/functions";

const DeleteTransaction = ({
  transactionDelete,
  setTransactionDelete,
  transactions,
  setTransactions,
}) => {
  const handleClose = () => {
    setTransactionDelete(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = getUser();
    try {
      await axios.delete(
        `https://app-criptofolio.herokuapp.com/api/transactions/deletetransaction/${user}/${transactionDelete}`
      );
    } catch (error) {
      console.log(error);
    }

    const validTransactions = excludeItems(transactions, {
      user: user,
      _id: transactionDelete,
    });
    await setTransactions(validTransactions);
    handleClose();
  };

  return (
    <Modal show={true} animation={false} onHide={handleClose} centered>
      <Modal.Header className="bg-dark border-0 pb-0">
        <Modal.Title>
          <h5 className="modal-title">Eliminar Transacción</h5>
        </Modal.Title>
        <CloseButton variant="white" onClick={handleClose} />
      </Modal.Header>
      <Modal.Body className="bg-dark">
        <form className="needs-validation mt-2" onSubmit={onSubmit}>
          <div className="text-center mt-2 mb-2">
            <div className="mb-4">
              Estás seguro que quieres eliminar esta transacción?
            </div>
            <button
              type="button"
              className="btn btn-secondary me-3"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Eliminar
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteTransaction;
