import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AppProvider } from "./context/AppContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <AppProvider>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </AppProvider>,
  document.getElementById("root")
);
