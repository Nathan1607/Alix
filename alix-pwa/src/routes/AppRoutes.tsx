import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Commune from "../pages/Commune/Commune";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/commune" element={<Commune />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
