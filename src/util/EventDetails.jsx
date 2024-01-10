import "../App.css";
import { useParams } from "react-router-dom";
import { useState } from "react";
import eventFacade from "/src/facade/eventFacade.js";

const EventDetails = () => {
  const { id } = useParams();
  const event = eventFacade.findEvent(id);

  const [splitCount, setSplitCount] = useState(1); // number of splits
  const [splitResult, setSplitResult] = useState([]); // split result

  const handleSplitChange = (newSplitCount) => {
    setSplitCount(newSplitCount);
  };

  const handleSplit = () => {
    if (event) {
      // calculate the split amount
      const splitAmount = event.totalAmount / splitCount;

      // create an array with each person's share
      const result = Array.from({ length: splitCount }, (_, index) => ({
        // map over the array and create an object for each person
        person: `Person ${index + 1}`,
        share: splitAmount.toFixed(2), // set the share amount to 2 decimal places
      }));

      // update the split result state
      setSplitResult(result);
    }
  };

  if (!event) {
    return <p>Begivenhed ikke fundet</p>;
  }

  return (
    <div>
      <main>
        <br></br>
        <h2>{event.name}</h2>
        <table className="EventDetails-table">
          <tbody></tbody>
        </table>
        {/* Button for choosing the number of splits */}
        <div>
          <label>Vælg antal opdelinger: </label>
          <input
            type="number"
            value={splitCount}
            onChange={(e) => handleSplitChange(parseInt(e.target.value) || 1)}
          />
        </div>
        {/* Button for splitting the total amount */}
        <br></br>
        <br></br>
        <button onClick={handleSplit} className="split-button">
          Del beløb
        </button>
        <br></br> <br></br>
        {/* Display the split result */}
        {splitResult.length > 0 && (
          <div className="split-result">
            <h3>Opdeling:</h3>
            <ul>
              {splitResult.map((item) => (
                <li key={item.person}>
                  {item.person}: {item.share} kr.
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="total-amount-bar">
          Samlede beløb: {event.totalAmount}
        </div>
      </main>
      <br></br>
      <footer>
        <div className="flex-container-admin">
          <div>
            <p>kontakt admin på tlf:. 12345678</p>
          </div>
        </div>
        <br></br>
      </footer>
    </div>
  );
};

export default EventDetails;
