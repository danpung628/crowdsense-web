import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CrowdMap from "./pages/CrowdMap";
import Transit from "./pages/Transit";
import Parking from "./pages/Parking";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crowd" element={<CrowdMap />} />
          <Route path="/transit" element={<Transit />} />
          <Route path="/parking" element={<Parking />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
