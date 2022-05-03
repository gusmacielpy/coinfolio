import React from "react";
import { Modal, Tabs, Tab } from "react-bootstrap";
import CloseButton from "react-bootstrap/esm/CloseButton";
import HandleTransactionForm from "./HandleTransactionForm";
import "../styles.css";
import "./Calendar.css";
import "./DateTimePicker.css";
import "./Clock.css";

const HandleTransaction = ({
  setHandleTransaction,
  handleTransaction,
  setTransactions,
  transactions,
  action,
}) => {
  const handleClose = () => setHandleTransaction([]);

  return (
    <Modal show={true} animation={false} onHide={handleClose}>
      <Modal.Header className="bg-dark border-0 pb-0">
        <Modal.Title>
          <h5 className="modal-title">
            {action === "edit"
              ? "Editar transacción"
              : "Agregar transacción a mi portfolio"}
          </h5>
        </Modal.Title>
        <CloseButton variant="white" onClick={handleClose} />
      </Modal.Header>
      <Modal.Body className="bg-dark">
        <Tabs
          defaultActiveKey={
            handleTransaction.type === "compra" || handleTransaction.type === ""
              ? "compra"
              : handleTransaction.type === "venta"
              ? "venta"
              : "transferencia"
          }
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="compra" title="Compra">
            <HandleTransactionForm
              handleTransaction={handleTransaction}
              handleClose={handleClose}
              transactions={transactions}
              setTransactions={setTransactions}
              formType="compra"
              action={action}
            />
          </Tab>
          <Tab eventKey="venta" title="Venta">
            <HandleTransactionForm
              handleTransaction={handleTransaction}
              handleClose={handleClose}
              transactions={transactions}
              setTransactions={setTransactions}
              formType="venta"
              action={action}
            />
          </Tab>
          <Tab eventKey="transferencia" title="Transferencia">
            <HandleTransactionForm
              handleTransaction={handleTransaction}
              handleClose={handleClose}
              transactions={transactions}
              setTransactions={setTransactions}
              formType="transfer"
              action={action}
            />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default HandleTransaction;
