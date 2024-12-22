import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import User from "./User";
import Member from "./Member";
import Projects from "./Projects";

const App: React.FC = () => {
  return (
    <Router>
      <div className="h-screen">
        {/* Home Button */}
        <nav className="fixed top-4 left-4">
          <Link
            to="/"
            className="home-button text-sm sm:text-lg lg:text-xl font-bold text-bone-white underline"
          >
            Home
          </Link>
        </nav>

        {/* Routing */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/member" element={<Member />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
