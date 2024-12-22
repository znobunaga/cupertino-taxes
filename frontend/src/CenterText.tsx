import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";

const CenterText: React.FC = () => {
  const messages = [
    "Explore Where Your Taxes Are Allocated.",
    "Empowering Transparency for Cupertino Residents.",
    "Connecting Projects, Residents, and Council.",
    "See How Taxes Support Your Community.",
    "Building Trust Through Tax Transparency.",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 9000); // Adjusted interval for the longer messages
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="text-center my-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-wide text-bone-white">
        <Typewriter
          key={currentMessageIndex}
          options={{
            delay: 40, // Typing speed (slower for longer messages)
            deleteSpeed: 30, // Deleting speed (slower for readability)
            cursor: "|",
            loop: false,
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString(messages[currentMessageIndex])
              .pauseFor(3000) // Increased pause to allow reading of the longer messages
              .deleteAll()
              .start();
          }}
        />
      </h2>
    </div>
  );
};

export default CenterText;
