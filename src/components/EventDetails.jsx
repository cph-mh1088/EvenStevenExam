import React, { useState } from "react";
import { useParams } from "react-router-dom";
import eventFacade from "/src/facade/eventFacade.js";

const EventDetails = () => {
  const { id } = useParams();
  const event = eventFacade.findEvent(id);

  const [splitResult, setSplitResult] = useState([]); // result of split
  const [selectedPeople, setSelectedPeople] = useState([]); // chosen people to split with

  /**
   * This method handles the toggling of persons
   * @param {string} person - The name of the person to toggle
   */
  const handlePersonToggle = (person) => {
    if (selectedPeople.includes(person)) {
      // Hvis personen allerede er valgt, fjern personen fra listen
      setSelectedPeople(selectedPeople.filter((f) => f !== person));
    } else {
      // Hvis personen ikke er valgt, tilføj personen til listen
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  /**
   * This method handles the splitting of expenses
   */
  const handleSplit = () => {
    if (selectedPeople.length > 0) {
      const splitAmount = event.totalAmount / selectedPeople.length;

      // Trin 2: Opret resultatliste med hver persons andel
      const result = [];
      selectedPeople.forEach((friend) => {
        result.push({ person: friend, share: splitAmount.toFixed(2) });
      });

      // Opdater splitResult-tilstanden med resultatet
      setSplitResult(result);
    }
  };

  return (
    <div>
      <main>
        <br />
        <h2>{event.name}</h2>
        {/* Vis udgiftslisten */}
        <div className="expense-list">
          <h3>Udgiftsliste:</h3>
          <ul>
            {event.expenses.map((expense, index) => (
              <li key={index}>
                {expense.description} ({expense.payer}):{" "}
                {expense.amount.toFixed(2)} kr.
              </li>
            ))}
          </ul>
        </div>
        {/* Vis det samlede beløb af udgifterne */}
        <div className="total-amount-bar">
          Samlede beløb: {event.totalAmount}
        </div>
        {/* Vælg dem du vil dele udgifterne med */}
        <div className="">
          <h3>Vælg dem du vil dele udgifterne med</h3>
          <div className="people-share-container">
            {event.friends.map((friend) => (
              <div key={friend}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedPeople.includes(friend)}
                    onChange={() => handlePersonToggle(friend)}
                    disabled={event.expenses.some(
                      (expense) => expense.payer === friend
                    )}
                  />
                  {friend}
                </label>
              </div>
            ))}
          </div>
        </div>
        <br />
        {/* Knap til at udføre opdeling af udgifter */}
        <button onClick={handleSplit} className="split-button">
          Del beløb
        </button>
        <br /> <br />
        {/* Vis resultatet af opdelingen, hvis der er nogen */}
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
      </main>
      <br />
      {/* Footer-sektion */}
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
