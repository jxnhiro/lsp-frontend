import { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Kendaraan from './pages/Kendaraan/Kendaraan';
import Pesanan from './pages/Pesanan/Pesanan';
import DetailPesanan from './pages/Pesanan/DetailPesanan';
function App() {
  useEffect(() => {}, []);

  return (
    <Router>
      <Routes>
        <Route path="/pesanan/:customerId" element={<DetailPesanan />} />
        <Route path="/kendaraan" element={<Kendaraan />} />
        <Route path="/" element={<Pesanan />} />
      </Routes>
    </Router>
  );
}

export default App;
