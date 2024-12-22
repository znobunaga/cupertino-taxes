import React from "react";
import CenterText from "./CenterText";

const Home: React.FC = () => {
  return (
    <div className="main-container">
      <div className="tino-taxes">TINO TAXES</div>
      <div className="mb-4 sm:mb-8"> {/* Added margin to push the text higher */}
        <CenterText />
      </div>
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
