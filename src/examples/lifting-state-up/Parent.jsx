import React, { useState } from "react";
import Child1 from "./Child1";
import Child2 from "./Child2";

function ParentComponent() {
  const [sharedCounter, setSharedCounter] = useState(0); // Delt state

  const handleCounterChange = (newCounter) => {
    // Opdater forældrekomponentens tilstand med den delte klikstæller
    setSharedCounter(newCounter);
  };

  return (
    <div>
      {/* Prop 'onCounterChange' til child1  */}
      <Child1 onCounterChange={handleCounterChange} />
      {/* Prop 'sharedCounter' til child2 */}
      <Child2 sharedCounter={sharedCounter} />
    </div>
  );
}

export default ParentComponent;
