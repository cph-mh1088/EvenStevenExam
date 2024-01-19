import React, { useState } from "react";
import { useParams } from "react-router-dom";
import eventFacade from "/src/facade/eventFacade.js";

const EventDetails = () => {
  const { id } = useParams();
  const event = eventFacade.findEvent(id);

  const [overPayer, setOverPayer] = useState([]); // overpayers
  const [splitResult, setSplitResult] = useState([]); // result of split
  const [selectedPeople, setSelectedPeople] = useState([]); // chosen non-payers to split with
  const [share, setShare] = useState(0); // share pr. person

  const handlePersonToggle = (person) => {
    if (selectedPeople.includes(person)) {
      // Hvis personen allerede er valgt, fjern personen fra listen
      setSelectedPeople(selectedPeople.filter((f) => f !== person));
    } else {
      // Hvis personen ikke er valgt, tilføj personen til listen
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  const getAllPeople = (payers, selected) => {
    return [...payers, ...selected];
  };

  const calculateShare = (totalAmount, payers, selected) => {
    // if zero non-payers are selected, split between all payers
    if (selected.length === 0) {
      return totalAmount / payers.length;
    } else {
      return totalAmount / (payers.length + selected.length);
    }
  };

  const findOverPayers = (allPeople, event, share) => {
    return allPeople.filter((person) => {
      const personExpenses = event.expenses.filter((e) => e.payer === person);
      // calculate the total expense amount for each person
      const personTotal = personExpenses.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );
      // return true if the person has paid more than the share
      return personTotal > share;
    });
  };

  const calculateOverPayersAmount = (overPayers, share, event) => {
    return overPayers.map((person) => {
      const personExpenses = event.expenses.filter((e) => e.payer === person);
      const personTotal = personExpenses.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );
      // return the amount the person has paid too much
      return personTotal - share;
    });
  };

  const calculateSplitResult = (overPayersAmount, selected) => {
    return overPayersAmount.map((amount) => {
      if (selected.length === 0) {
        return amount / overPayersAmount.length;
      }
      return amount / selected.length;
    });
  };

  const handleSplit = () => {
    const totalAmount = event.totalAmount;
    const payers = event.expenses.map((e) => e.payer);
    const selected = selectedPeople;

    const newShare = calculateShare(totalAmount, payers, selected);
    setShare(newShare);

    const allPeople = getAllPeople(payers, selected);
    console.log("all people: " + allPeople);

    const overPayers = findOverPayers(allPeople, event, newShare);
    setOverPayer(overPayers);
    console.log("Overpayers: " + overPayers);

    const overPayersAmount = calculateOverPayersAmount(
      overPayers,
      newShare,
      event
    );
    console.log("Share:" + newShare);

    const split = calculateSplitResult(overPayersAmount, selected);
    setSplitResult(split);
    console.log("Split: " + split);
  };

  return (
    <div>
      <main>
        <br />
        <h2>{event.name}</h2>
        <div className="reciept-style">
          <h3>Udgiftsliste</h3>
          <ul className="expense-list">
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
          <p>Samlede udgifter: {event.totalAmount.toFixed(2)} kr.</p>
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
                    disabled={event.expenses.some((e) => e.payer === friend)}
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
          Del beløbet
        </button>
        <br /> <br />
        {/* Vis resultatet af opdelingen, hvis der er nogen */}
        <div className="split-result">
          <h3>Opdeling:</h3>
          <p>Hver deltager skal betale nedenstående beløb til udlægger</p>
          <ul>
            {splitResult.map((amount, index) => (
              <li key={index}>
                {overPayer[index]} skal modtage: {amount.toFixed(2)} kr. i alt
                {/* Her skal der lige laves noget logik */}
                {amount > 0 &&
                  ` fordi ${overPayer[index]} allerede har betalt ${Math.abs(
                    amount
                  ).toFixed(2)} kr. til begivenheden fra ${
                    selectedPeople.length
                  } person${selectedPeople.length !== 1 ? "er" : ""}`}
              </li>
            ))}
          </ul>
        </div>
        <div className="expense-pr-person">
          <p>{"udgift pr. person: " + share.toFixed(2)}</p>
        </div>
      </main>
      <br />
      <footer></footer>
    </div>
  );
};

export default EventDetails;
