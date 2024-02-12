import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ChatPage from "./components/ChatPage";
import Header from "./components/Header";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <React.Fragment>
        <Header />
        <App />
      </React.Fragment>
    ),
  },
  {
    path: "/ChatPage",
    element: (
      <React.Fragment>
        <ChatPage showHeader={true} />
      </React.Fragment>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router}></RouterProvider>);
