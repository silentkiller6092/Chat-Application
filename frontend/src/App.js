import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import AddUser from "./components/AddUser";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Header /> */}
        <main>
          <Outlet />
        </main>
        <AddUser />
      </header>
    </div>
  );
}

export default App;
