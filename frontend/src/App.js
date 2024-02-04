import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import AddUser from "./components/AddUser";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
        <AddUser />
      </header>
    </div>
  );
}

export default App;
