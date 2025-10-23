import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CrowdMap from "./pages/CrowdMap";
import Transit from "./pages/Transit";
import Parking from "./pages/Parking";

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-blue-500 text-white p-4 flex gap-4">
        <Link to="/" className="hover:underline">
          홈
        </Link>
        <Link to="/crowd" className="hover:underline">
          인파
        </Link>
        <Link to="/transit" className="hover:underline">
          교통
        </Link>
        <Link to="/parking" className="hover:underline">
          주차
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crowd" element={<CrowdMap />} />
        <Route path="/transit" element={<Transit />} />
        <Route path="/parking" element={<Parking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
