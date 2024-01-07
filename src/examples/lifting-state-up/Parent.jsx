import React, { useState } from "react";
import Child from "./Child";

const Parent = () => {
  const [count, setCount] = useState(0); // state for counting

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h2>Parent Component</h2>
      <p>Count: {count}</p>
      {/* pass the state and method as props to the child component */}
      <Child count={count} onIncrement={handleIncrement} />
    </div>
  );
};

export default Parent;
