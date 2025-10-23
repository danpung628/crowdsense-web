import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CrowdMap from "./pages/CrowdMap";
import Transit from "./pages/Transit";
import Parking from "./pages/Parking";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">홈</Link> |<Link to="/crowd">인파</Link> |
        <Link to="/transit">교통</Link> |<Link to="/parking">주차</Link>
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
