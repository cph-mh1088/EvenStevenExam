import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
      // Find ud af hvem der har betalt noget, og hvem der har intet betalt
      const paidSomething = nonOverPayers
        .map((person) => {
          const personExpenses = event.expenses.filter(
            (e) => e.payer === person
          );
          const personTotal = personExpenses.reduce(
            (acc, cur) => acc + cur.amount,
            0
          );
          console.log("personTotal for " + person + ": " + personTotal);

          // Returner et objekt med personens navn og det beløb, de har betalt
          return { person, personTotal };
        })
        .filter((item) => item.personTotal > 0); // Filtrer kun dem, der har betalt noget

      console.log("paidSomething: ", paidSomething);

      // Hvis de har betalt noget, find ud af hvor meget de mangler, før de har betalt deres share
      paidSomething.forEach((paid) => {
        const remainingPayment = share - paid.personTotal;
        console.log(`${paid.person} mangler at betale: ${remainingPayment}`);
      });

      // Hvis de ikke har betalt noget, skal de betale hele deres share

      // Beregn andelen for den aktuelle person
      return amount / nonOverPayers.length;
    });

    setNonOverPayersShare(nonOverPayersShare);
    console.log("non overpayers share: " + nonOverPayersShare);
  };

  return (
    <div>
      <main>
        <h2 className="event-name">{event.name}</h2>
        <div className="participant-checkbox">
          <h4>Vælg dem du vil dele udgifterne med</h4>
          <p>
            OBS man ikke kan vælge dem der har lagt ud. De er allerede
            medregnet.
          </p>
          <div className="people-share-container">
            {event.participants.map((friend) => (
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
        <div className="expenselist">
          <h4>Udgiftsliste</h4>
          <div className="expense-list">
            {event.expenses.map((expense, index) => (
              <div key={index} className="expense-list-items">
                {expense.description} ({expense.payer}):{" "}
                {expense.amount.toFixed(2)} kr.
              </div>
            ))}
          </div>
        </div>
        <div className="total-amount-bar">
          <p>Samlede udgifter: {event.totalAmount.toFixed(2)} kr.</p>
        </div>
        <br />
        <button className="split-button" onClick={handleSplit}>
          Del beløb
        </button>
        <br /> <br />
        <div className="due-amount">
          <h3>Regnskab</h3>
          <div className="share-per-person">
            <p>
              {"Udgift pr. person: "}
              <span style={{ color: "#ed6464" }}>
                {share.toFixed(2) + " kr."}
              </span>
            </p>
          </div>
          {overPayers.length > 0 && (
            <div className="due-amount-owed-container">
              {overPayers.map((overPayer, index) => (
                <div key={index} className="due-amount-owed">
                  {overPayer} skal modtage:{" "}
                  <span style={{ color: "#4a8f5a" }}>
                    {overPayersAmount[index].toFixed(2)} kr.
                  </span>{" "}
                </div>
              ))}
            </div>
          )}
          {nonOverPayers.length > 0 && overPayers.length > 0 && (
            <div className="missing-payment-container">
              {/* iterate over nonOverPayers to show the amount owed */}
              {nonOverPayers.map((nonOverPayer, nonIndex) => (
                <div key={nonIndex} className="non-overpayer-details">
                  <h4>{nonOverPayer} skal betale:</h4>
                  {/* list of OverPayers and their respected "debtors" */}
                  <div className="overpayers-list">
                    {overPayers.map((overPayer, overIndex) => (
                      // iterate over overPayers to show the amount owed to each overPayer
                      <div key={overIndex} className="overpayer-amount">
                        {overPayer}:{" "}
                        <span style={{ color: "#ed6464" }}>
                          {nonOverPayersShare[overIndex].toFixed(2)} kr.
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <br />
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
