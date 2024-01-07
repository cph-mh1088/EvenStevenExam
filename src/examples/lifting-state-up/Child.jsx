import React from "react";

const Child = ({ count, onIncrement }) => {
  return (
    <div>
      <h2>Child Component</h2>
      <p>Count in Child: {count}</p>
      {/* updates state in parent komponent */}
      <button onClick={onIncrement}>Increment Count</button>
    </div>
  );
};

export default Child;
