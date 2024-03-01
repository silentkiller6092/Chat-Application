import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ChatPage from "./components/ChatPage";
import Header from "./components/Header";
import Profile from "./components/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <React.Fragment>
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
  {
    path: "/profile/:username",
    element: (
      <React.Fragment>
        <Header />
        <Profile />
      </React.Fragment>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router}></RouterProvider>);
