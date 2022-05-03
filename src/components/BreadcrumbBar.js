import React from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";

const BreadcrumbBar = ({ coin }) => {
  return (
    <div class="container mt-4 ps-0">
      <Breadcrumb className="link">
        <Breadcrumb.Item>
          <Link to="/" className="link">
            Inicio
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Transacciones de {coin}</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbBar;
