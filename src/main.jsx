import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import App from "./App";
import CookieConsent from "./privacy/CookieConsent";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <CookieConsent><App /></CookieConsent>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
