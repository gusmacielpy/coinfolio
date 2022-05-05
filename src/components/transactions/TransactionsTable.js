import React, { useState, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import Table from "react-bootstrap/Table";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import HandleTransaction from "./HandleTransaction";
import DeleteTransaction from "./DeleteTransaction";
import { toFix2, getTransactionPNL } from "../../utils/functions";

const TransactionsTable = ({
  coinId,
  coins,
  transactions,
  setTransactions,
}) => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionDelete, setTransactionDelete] = useState(null);
  const [editTransaction, setEditTransaction] = useState([]);

  const coin = coins.find((coin) => coin.id === coinId);

  useEffect(() => {
    if (transactions.length !== 0) {
      setFilteredTransactions(
        transactions.filter((transaction) => transaction.idCoin === coinId)
      );
    }
  }, [transactions, setFilteredTransactions, coinId]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Tipo",
        accessor: (row) => (
          <span
            style={{
              color: `${
                row.type === "venta" || row.type === "transf saliente"
                  ? "#E15241"
                  : "#8DC647"
              }`,
              textTransform: "capitalize",
            }}
          >
            {`${row.type}`}
          </span>
        ),
        className: "text-center",
      },
      {
        Header: "Precio",
        accessor: (row) => (
          <span style={{ color: "#A5A5A5" }}>{row.price}</span>
        ),
        className: "text-center",
      },
      {
        Header: "Cantidad",
        accessor: (row) => (
          <span
            style={{
              color: `${
                row.type === "venta" || row.type === "transf saliente"
                  ? "#E15241"
                  : "#8DC647"
              }`,
            }}
          >
            {`${
              row.type === "venta" || row.type === "transf saliente" ? "-" : "+"
            }${row.quantity}`}
          </span>
        ),
        className: "text-center",
      },
      {
        Header: "Fecha",
        accessor: (row) => {
          const date = new Date(row.dateTime);
          return (
            <span style={{ color: "#A5A5A5" }}>{`${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}</span>
          );
        },
        className: "text-center",
      },
      {
        Header: "Costo",
        accessor: (row) => (
          <span style={{ color: "#A5A5A5" }}>
            {row.type === "compra"
              ? toFix2((row.quantity * row.price).toString())
              : "-"}
          </span>
        ),
        className: "text-center",
      },
      {
        Header: "PNL",
        accessor: (row) => (
          <span
            style={{
              color: `${
                getTransactionPNL(coin, row) <= 0 ? "#E15241" : "#8DC647"
              }`,
            }}
          >
            {row.type !== "venta"
              ? `${toFix2(getTransactionPNL(coin, row).toString())}$`
              : "-"}
          </span>
        ),
        className: "text-center",
      },
      {
        Header: "Operaciones",
        accessor: (row) => (
          <div>
            <FaRegEdit
              className="fs-6 mx-1 formattedNum-btn"
              alt="Agregar transaccion"
              onClick={() => handleEditTransaction(row)}
            />
            <FaRegTrashAlt
              className="fs-6 mx-1 formattedNum-btn"
              alt="Eliminar moneda"
              onClick={() => setTransactionDelete(row._id)}
            />
          </div>
        ),
        className: "text-center",
      },
    ], // eslint-disable-next-line
    [filteredTransactions]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    pageCount,
    gotoPage,
    state,
    prepareRow,
  } = useTable(
    {
      columns,
      data: filteredTransactions,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );

  const handleEditTransaction = (row) => {
    setEditTransaction({
      ...row,
    });
  };

  return (
    <>
      <Table
        striped
        bordered
        hover
        responsive
        variant="dark"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className="text-center"
                  style={{ color: "#9B9B9B" }}
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className={`align-middle small ${
                        cell.column.className ?? ""
                      }`}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="row align-items-center justify-content-between">
        <div className="col-lg-6">
          <span className="d-none d-lg-block">
            Página{" "}
            <strong>
              {state.pageIndex + 1} de {pageOptions.length}
            </strong>{" "}
          </span>
        </div>
        <div className="col-lg-6 text-center text-lg-end">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="border-0"
          >
            {"<<"}
          </button>{" "}
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="border-0"
          >
            {"<"}
          </button>{" "}
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="border-0"
          >
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="border-0"
          >
            {">>"}
          </button>{" "}
        </div>
      </div>
      {editTransaction._id && (
        <HandleTransaction
          handleTransaction={editTransaction}
          setHandleTransaction={setEditTransaction}
          setTransactions={setTransactions}
          transactions={transactions}
          action={"edit"}
        />
      )}
      {transactionDelete && (
        <DeleteTransaction
          transactionDelete={transactionDelete}
          setTransactionDelete={setTransactionDelete}
          transactions={transactions}
          setTransactions={setTransactions}
        />
      )}
    </>
  );
};

export default TransactionsTable;
