import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Commune from "../pages/Commune/Commune";
import Detail from "../pages/Commune/Details";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/commune" element={<Commune />} />
        <Route path="/detail" element={<Detail />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
