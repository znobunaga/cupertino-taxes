import React from "react";
import CenterText from "./CenterText";

const Home: React.FC = () => {
  return (
    <div className="main-container">
      <div className="tino-taxes">TINO TAXES</div>
      <div className="mb-4 sm:mb-8">
        <CenterText />
      </div>
      <div className="box-container mt-6 sm:mt-7">
        {/* Adjusted margin-top for buttons */}
        <div className="box">
          <a href="/user">Residents</a>
        </div>
        <div className="box">
          <a href="/member">Council</a>
        </div>
        <div className="box">
          <a href="/projects">Projects</a>
        </div>
      </div>
      {/* Updated "Built by znobunaga" section with extra margin */}
      <div className="mt-12 sm:mt-16 text-sm sm:text-base text-center">
        <a
          href="https://www.znobunaga.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-bone-white transition"
        >
          Built by znobunaga
        </a>
      </div>
    </div>
  );
};

export default Home;
