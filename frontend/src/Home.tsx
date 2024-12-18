import React from "react";
import CenterText from "./CenterText";

const Home: React.FC = () => {
  return (
    <div className="main-container">
      <div className="tino-taxes">TINO TAXES</div>
      <CenterText />
      <div className="box-container">
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
    </div>
  );
};

export default Home;
