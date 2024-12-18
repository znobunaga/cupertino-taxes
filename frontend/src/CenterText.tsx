import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";

const CenterText: React.FC = () => {
  const messages = [
    "Connecting Residents to the Council.",
    "Helping the Council Fund Projects.",
    "Making Taxes Transparent.",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 7000); // Adjust timing to match typing/deleting speed
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="text-center my-8">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-wide text-bone-white">
        <Typewriter
          key={currentMessageIndex}
          options={{
            delay: 50, // Typing speed
            deleteSpeed: 40, // Deleting speed
            cursor: "|", // Default cursor
            loop: false, // Handle looping manually
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString(messages[currentMessageIndex]) // Type current message
              .pauseFor(2000) // Pause after typing
              .deleteAll() // Delete message
              .start();
          }}
        />
      </h2>
    </div>
  );
};

export default CenterText;
