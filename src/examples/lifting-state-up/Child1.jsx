import React, { useState } from "react";

// modtager prop fra forælder
function Child1({ onCounterChange }) {
  const [clickCount, setClickCount] = useState(0);

  const handleButtonClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    // løft state op til forælder ved at kalde funktionen fra props
    onCounterChange(newCount);
  };

  return (
    <div>
      <p>Child1 Click Count: {clickCount}</p>
      <button onClick={handleButtonClick}>Increment Counter</button>
    </div>
  );
}
