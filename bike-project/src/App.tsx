import "./App.css";
import BikeTable from "./Components/BikeTable";
import data from "./bikes_response.json";

// data is param name and {data} is what gets passed into function.
function App() {
  return (
    <>
      <BikeTable data={data} />
    </>
  );
}

export default App;
