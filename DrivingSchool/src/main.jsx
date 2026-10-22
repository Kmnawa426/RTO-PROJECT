import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import MyContext from "./MyContext/MyContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <MyContext>
      <App />
    </MyContext>
    </BrowserRouter>
  </React.StrictMode>
);
