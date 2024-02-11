import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ChatPage from "./components/ChatPage";
import Header from "./components/Header";
import ChatPagesmallDevice from "./components/ChatPagesmallDevice";

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
        <Header />
        <ChatPage />
      </React.Fragment>
    ),
  },
  {
    path: "/smallDeive",
    element: (
      <React.Fragment>
        <ChatPagesmallDevice />
      </React.Fragment>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router}></RouterProvider>);
