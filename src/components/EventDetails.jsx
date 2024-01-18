import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import eventFacade from "/src/facade/eventFacade.js";

const EventDetails = () => {
  const { id } = useParams();
  const event = eventFacade.findEvent(id);

  const [overPayer, setOverPayer] = useState([]); // overpayers
  const [splitResult, setSplitResult] = useState([]); // result of split
  const [selectedPeople, setSelectedPeople] = useState([]); // chosen people to split with
  const [share, setShare] = useState(0); // Opdateret med useState

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
   * Method to get all people involved in the event
   * @param {String[]} list of people who paid
   * @param {String[]} list of selected people to split with
   * @returns {String[]} all people involved in the event
   */
  const getAllPeople = (payers, selected) => {
    return [...payers, ...selected];
  };

  /**
   * Method to find people who paid more than their share based on total amount and expenses
   * @param {string[]} allPeople
   * @param {object} event
   * @param {number} share
   * @returns {string[]} list over people who paid more than their share
   */
  const findOverPayers = (allPeople, event, share) => {
    return allPeople.filter((person) => {
      const personExpenses = event.expenses.filter((e) => e.payer === person);
      const personTotal = personExpenses.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );
      return personTotal > share;
    });
  };

  /**
   * Method to calculate the amount each overpayer paid too much
   * @param {String []} list of overPayers
   * @param {number} share
   * @param {object} event
   * @returns {number []} list of amount each overpayer paid too much
   */
  const calculateOverPayersAmount = (overPayers, share, event) => {
    return overPayers.map((person) => {
      const personExpenses = event.expenses.filter((e) => e.payer === person);
      const personTotal = personExpenses.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );
      return personTotal - share;
    });
  };
  useEffect(() => {
    const allPeople = getAllPeople(
      event.expenses.map((e) => e.payer),
      selectedPeople
    );
    const overPayers = findOverPayers(allPeople, event, share);
    setOverPayer(overPayers);

    const overPayersAmount = calculateOverPayersAmount(
      overPayers,
      share,
      event
    );

    const split = calculateSplitResult(overPayersAmount, selectedPeople);
    setSplitResult(split);
  }, [share]);

  const calculateSplitResult = (overPayersAmount, selected) => {
    return overPayersAmount.map((amount) => {
      return amount / selected.length;
    });
  };

  /**
   * Method to calculate the share of each person
   * @param {number} totalAmount
   * @param {string[]} list of payers
   * @param {string[]} list of people to split with
   * @returns {number} share
   */
  const calculateShare = (totalAmount, payers, selected) => {
    return totalAmount / (payers.length + selected.length);
  };

  /**
   * Method to handle the split of expenses from an event
   */
  const handleSplit = () => {
    const totalAmount = event.totalAmount;
    const payers = event.expenses.map((e) => e.payer);
    const selected = selectedPeople;

    const newShare = calculateShare(totalAmount, payers, selected);
    setShare(newShare);
    console.log("Share:" + newShare);

    const allPeople = getAllPeople(payers, selected);
    console.log("all people: " + allPeople);

    const overPayers = findOverPayers(allPeople, event, newShare); // Opdateret med newShare
    setOverPayer(overPayers);
    console.log("Overpayers: " + overPayers);

    const overPayersAmount = calculateOverPayersAmount(
      overPayers,
      newShare,
      event
    );

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
          Del beløb
        </button>
        <br /> <br />
        {/* Vis resultatet af opdelingen, hvis der er nogen */}
        <div className="split-result">
          <h3>Opdeling:</h3>
          <p>Hver valgt deltager skal betale nedenstående beløb til udlægger</p>
          <ul>
            {splitResult.map((amount, index) => (
              <li key={index}>
                {overPayer[index]}: {amount.toFixed(2)} kr.
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
