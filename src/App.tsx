import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Kendaraan from "./pages/Kendaraan/Kendaraan";
function App() {
  useEffect(() => {}, []);

  return (
    <Router>
      <Routes>
        <Route path="/mobil" element={<Kendaraan />} />
      </Routes>
    </Router>
  );
}

export default App;
