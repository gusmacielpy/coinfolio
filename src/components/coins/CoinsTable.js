import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { Sparklines, SparklinesLine } from "react-sparklines";
import HandleTransaction from "../transactions/HandleTransaction";
import { FaPlus, FaListUl, FaRegTrashAlt } from "react-icons/fa";
import HoldingCoins from "./HoldingCoins";
import DeleteCoin from "./DeleteCoin";
import { Link } from "react-router-dom";
import Transactions from "../../routes/Transactions";

import { useTable, usePagination } from "react-table";

const CoinsTable = ({ coins, setCoins, setTransactions, transactions }) => {
  const [coinDelete, setCoinDelete] = useState(null);
  const [newTransaction, setNewTransaction] = useState([]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: (row) => (
          <div className="container col-auto m-0">
            <div className="row flex-nowrap p-0">
              <div className="col-auto text-end p-0">
                <img
                  src={row.image}
                  alt={row.name}
                  className="me-2"
                  style={{ width: "18px", height: "18px" }}
                />
              </div>
              <div className="col-auto text-start ps-0">
                <span style={{ fontWeight: "bold" }}>
                  {row.name}&nbsp;({row.symbol})
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        Header: "Precio",
        accessor: (row) => (
          <span style={{ color: "#A5A5A5" }}>{row.current_price}</span>
        ),
        className: "text-center",
      },
      {
        Header: "1h",
        accessor: (row) => (
          <span
            style={{ color: `${row.change_1h < 0 ? "#E15241" : "#8DC647"}` }}
          >
            {row.change_1h + "%"}
          </span>
        ),
        className: "text-center",
      },
      {
        Header: "24h",
        accessor: (row) => (
          <span
            style={{ color: `${row.change_24h < 0 ? "#E15241" : "#8DC647"}` }}
          >
            {row.change_24h + "%"}
          </span>
        ),
        className: "text-center",
      },
      {
        Header: "7d",
        accessor: (row) => (
          <span
            style={{ color: `${row.change_7d < 0 ? "#E15241" : "#8DC647"}` }}
          >
            {row.change_7d + "%"}
          </span>
        ),
        className: "text-center",
      },
      {
        Header: "Últimos 7 días",
        accessor: (row) => (
          <Sparklines data={row.sparkline_7d}>
            <SparklinesLine color={`${row.change_7d < 0 ? "red" : "green"}`} />
          </Sparklines>
        ),
        className: "text-center",
      },

      {
        Header: "Activos",
        accessor: (row) => (
          <HoldingCoins coin={row} transactions={transactions} />
        ),
        className: "text-center",
      },
      {
        Header: "Operaciones",
        accessor: (row) => (
          <div>
            <FaPlus
              className="fs-6 mx-1 formattedNum-btn"
              alt="Agregar transaccion"
              onClick={() =>
                handleNewTransaction(
                  row.id,
                  row.name,
                  row.symbol,
                  row.current_price
                )
              }
            />

            <Link to={`/transactions/${row.id}`} element={<Transactions />}>
              <FaListUl className="fs-6 mx-1 formattedNum-btn" />
            </Link>

            <FaRegTrashAlt
              className="fs-6 mx-1 formattedNum-btn"
              alt="Eliminar moneda"
              onClick={() => setCoinDelete(row)}
            />
          </div>
        ),
        className: "text-center",
      },
    ], // eslint-disable-next-line
    [transactions]
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
    { columns, data: coins, initialState: { pageIndex: 0, pageSize: 10 } },
    usePagination
  );

  const handleNewTransaction = (idCoin, name, symbol, price) => {
    setNewTransaction({
      idCoin,
      name,
      symbol,
      price,
      quantity: 0,
      dateTime: "",
      type: "",
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
      {newTransaction.name && (
        <HandleTransaction
          setHandleTransaction={setNewTransaction}
          handleTransaction={newTransaction}
          setTransactions={setTransactions}
          transactions={transactions}
          action={"new"}
        />
      )}
      {coinDelete && (
        <DeleteCoin
          coinDelete={coinDelete}
          setCoinDelete={setCoinDelete}
          coins={coins}
          setCoins={setCoins}
          transactions={transactions}
          setTransactions={setTransactions}
        />
      )}
    </>
  );
};

export default CoinsTable;
