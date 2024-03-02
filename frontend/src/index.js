import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux"; // Import Provider
import store from "./app/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ChatPage from "./components/ChatPage";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Protected from "./components/Protected";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
let persistor = persistStore(store);

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
    path: "/chatPage",
    element: (
      <Protected>
        <ChatPage showHeader={true} />
      </Protected>
    ),
  },
  {
    path: "/profile/:username",
    element: (
      <Protected>
        <Header />
        <Profile />
      </Protected>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <RouterProvider router={router}></RouterProvider>
    </PersistGate>
  </Provider>
);
