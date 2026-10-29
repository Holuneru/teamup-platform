import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { UserProvider } from "./context/UserContext";
import { FeedbackProvider } from "./context/FeedbackContext";

import "./index.css";
import "./styles/auth.css";
import "./styles/team-theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <FeedbackProvider>
            <UserProvider>
                <App />
            </UserProvider>
        </FeedbackProvider>

    </React.StrictMode>

);