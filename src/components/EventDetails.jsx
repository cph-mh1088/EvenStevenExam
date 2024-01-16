import React, { useState } from "react";
import { useParams } from "react-router-dom";
import eventFacade from "/src/facade/eventFacade.js";

const EventDetails = () => {
  const { id } = useParams();
  const event = eventFacade.findEvent(id);

  const [splitResult, setSplitResult] = useState([]); // result of split
  const [selectedFriends, setSelectedFriends] = useState([]); // chosen persons to split with

  const handleFriendToggle = (friend) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends(selectedFriends.filter((f) => f !== friend));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleSplit = () => {
    if (event && selectedFriends.length > 0) {
      const splitAmount = event.totalAmount / (selectedFriends.length + 1); // +1 for den, der har betalt
      const result = [];

      result.push({ person: event.name, share: 0 });

      selectedFriends.forEach((friend) => {
        result.push({ person: friend, share: splitAmount.toFixed(2) });
      });

      setSplitResult(result);
    }
  };

  return (
    <div>
      <main>
        <br />
        <h2>{event.name}</h2>
        <div>
          <h3>Vælg personer at dele udgiften med:</h3>
          <ul>
            {event.friends.map((friend) => (
              <li key={friend}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFriends.includes(friend)}
                    onChange={() => handleFriendToggle(friend)}
                  />
                  {friend}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleSplit} className="split-button">
          Del beløb
        </button>
        <br /> <br />
        {/* Vis resultatet af opdelingen */}
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
      <br />
      <footer>
        <div className="flex-container-admin">
          <div>
            <p>kontakt admin på tlf:. 12345678</p>
          </div>
        </div>
        <br />
      </footer>
    </div>
  );
};

export default EventDetails;
