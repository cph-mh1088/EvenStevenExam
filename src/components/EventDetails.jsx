import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import eventFacade from "/src/facade/eventFacade.js";

const EventDetails = () => {
  const { id } = useParams();
  const event = eventFacade.findEvent(id);
  const totalAmount = event.totalAmount;
  const payers = event.expenses.map((expense) => expense.payer);

  const [selectedParticipants, setSelectedParticipants] = useState([]); // chosen participants to split with
  const [overPayers, setOverPayers] = useState([]); // people who have paid too much
  const [overPayersAmount, setOverPayersAmount] = useState([]); // amount each overpayer has paid too much
  const [nonOverPayers, setNonOverPayers] = useState([]); // people who have not paid too much
  const [nonOverPayersShare, setNonOverPayersShare] = useState([]); // amount each non-overpayer owes each overpayer
  const [share, setShare] = useState(0); // share per person

  // handle the selection of participants (excluding expositors)
  const handlePersonToggle = (person) => {
    if (selectedParticipants.includes(person)) {
      // if the person is already selected, remove the person from the list
      setSelectedParticipants(selectedParticipants.filter((f) => f !== person));
    } else {
      setSelectedParticipants([...selectedParticipants, person]);
    }
  };

  // find all participants involved
  const getAllPeople = (payers, selected) => {
    return [...payers, ...selected];
  };

  // find each participants share
  const calculateShare = (totalAmount, payers, selected) => {
    // if zero non-payers are selected, split between all payers
    if (selected.length === 0) {
      return totalAmount / payers.length;
    } else {
      return totalAmount / (payers.length + selected.length);
    }
  };

  // find participants who have paid more than their share
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

  // find the amount each overpayer has paid too much
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

  // NOTE - what happens if a person has paid exactly their share? This could be a problem
  // find the participants who have not paid their share or more
  const findNonOverPayers = (allPeople, overPayers) => {
    return allPeople.filter((person) => {
      return !overPayers.includes(person);
    });
  };

  // handle the exact split of the expenses
  // all the logs are currently for testing and guidance
  const handleSplit = () => {
    console.log("payers: " + payers);

    // get all participants
    const allParticipants = getAllPeople(payers, selectedParticipants);
    console.log("all partisipants: " + allParticipants);

    console.log("total amount: " + totalAmount);

    // calculate share
    const share = calculateShare(totalAmount, payers, selectedParticipants);
    setShare(share);
    console.log("share: " + share);

    // find overpayers
    const overPayers = findOverPayers(allParticipants, event, share);
    console.log("overpayers: " + overPayers);
    setOverPayers(overPayers);

    // find overpayers amount
    const overPayersAmount = calculateOverPayersAmount(
      overPayers,
      share,
      event
    );
    setOverPayersAmount(overPayersAmount);
    console.log("overpayers amount: " + overPayersAmount);

    // find nonoverpayers ("debtors")
    const nonOverPayers = findNonOverPayers(allParticipants, overPayers);
    setNonOverPayers(nonOverPayers);
    console.log("non overpayers: " + nonOverPayers);

    // find nonoverpayers share
    const nonOverPayersShare = overPayersAmount.map((amount) => {
      return amount / nonOverPayers.length;
    });
    setNonOverPayersShare(nonOverPayersShare);
    console.log("non overpayers share: " + nonOverPayersShare);
  };

  return (
    <div>
      <main>
        <br />
        <h2>{event.name}</h2>
        <div className="expenselist">
          <h3>Udgiftsliste</h3>
          <ul>
            {event.expenses.map((expense, index) => (
              <li key={index} className="expense-list">
                {expense.description} ({expense.payer}):{" "}
                {expense.amount.toFixed(2)} kr.
              </li>
            ))}
          </ul>
        </div>
        <div className="total-amount-bar">
          <p>Samlede udgifter: {event.totalAmount.toFixed(2)} kr.</p>
        </div>
        <div className="participant-checkbox">
          <h3>Vælg dem du vil dele udgifterne med</h3>
          <p>
            obs man kan ikke vælge dem der har lagt ud. De er allerede med i
            beregningen
          </p>
          <div className="people-share-container">
            {event.friends.map((friend) => (
              <div key={friend}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(friend)}
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
        <button className="split-button" onClick={handleSplit}>
          Del beløbet
        </button>
        <br /> <br />
        <div className="share-per-person">
          <p>{"udgift pr. person: " + share.toFixed(2) + " kr."}</p>
        </div>
        <div className="due-amount">
          <h3>Opdeling:</h3>
          {overPayers.length > 0 && (
            <div className="due-amount-owed">
              <ul>
                {overPayers.map((overPayer, index) => (
                  <li key={index}>
                    <div className="due-amount-owed">
                      {overPayer} skal modtage:{" "}
                      {overPayersAmount[index].toFixed(2)} kr.
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {nonOverPayers.length > 0 && overPayers.length > 0 && (
            <div>
              <h3>Manglende betaling</h3>
              {/* iterate over nonOverPayers to show the amount owed */}
              {nonOverPayers.map((nonOverPayer, nonIndex) => (
                <div key={nonIndex}>
                  <h4>{nonOverPayer} skal betale:</h4>
                  {/* list of OverPayers and their respected "debtors" */}
                  <ul>
                    {overPayers.map((overPayer, overIndex) => (
                      // iterate over overPayers to show the amount owed to each overPayer
                      <li key={overIndex}>
                        {overPayer} - {nonOverPayersShare[overIndex].toFixed(2)}{" "}
                        kr.
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
