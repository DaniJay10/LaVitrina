import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
