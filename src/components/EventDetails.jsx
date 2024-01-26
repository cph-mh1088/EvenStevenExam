import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import eventFacade from "/src/facade/eventFacade.js";

const EventDetails = () => {
  const { id } = useParams();
  const event = eventFacade.findEvent(id);
  const totalAmount = event.totalAmount;
  const payers = event.expenses.map((expense) => expense.payer);

  const [selectedParticipants, setSelectedParticipants] = useState([]); // chosen participants
  const [overPayers, setOverPayers] = useState([]); // expositors who paid more than their share
  const [overPayersAmount, setOverPayersAmount] = useState([]); // amount each expositor paid too much
  const [nonOverPayers, setNonOverPayers] = useState([]); // participants who paid nothing, less & exactly their share
  const [nonOverPayersShare, setNonOverPayersShare] = useState([]); // amount a nonOverPayer is due
  const [share, setShare] = useState(0); // share pr. person

  const handlePersonToggle = (person) => {
    if (selectedParticipants.includes(person)) {
      // if person is already selected, remove person from list
      setSelectedParticipants(selectedParticipants.filter((f) => f !== person));
    } else {
      setSelectedParticipants([...selectedParticipants, person]);
    }
  };

  // get all people involved
  const getAllPeople = (payers, selected) => {
    return [...payers, ...selected];
  };

  // calculate each persons share
  const calculateShare = (totalAmount, payers, selected) => {
    // if no participants are selected, share between payers
    if (selected.length === 0) {
      return totalAmount / payers.length;
    } else {
      return totalAmount / (payers.length + selected.length);
    }
  };

  // find all expositors who have paid more than their share
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

  // find the amount each overPayer has paid too much
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

  // find all nonOverPayers
  const findNonOverPayers = (allPeople, overPayers) => {
    return allPeople.filter((person) => {
      return !overPayers.includes(person);
    });
  };

  // find the amount each nonOverPayer is due
  const calculateNonOverPayersRemainingAmount = (
    nonOverPayers,
    share,
    event
  ) => {
    const remainingPayments = [];

    const paidSomething = nonOverPayers.map((person) => {
      const personExpenses = event.expenses.filter((e) => e.payer === person);
      // find total expenses for each person
      const personTotal = personExpenses.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );

      // print status for each person
      console.log("personTotal for " + person + ": " + personTotal);

      return { person, personTotal };
    });

    // find the amount each nonOverPayer is due before they have paid their share
    paidSomething.forEach((paid) => {
      const remainingPayment = share - paid.personTotal;
      console.log(
        `${paid.person} mangler at betale: ${remainingPayment.toFixed(2)}`
      );
      // add remainingPayment to remainingPayments array
      remainingPayments.push(remainingPayment);
    });
    return remainingPayments;
  };

  // handle split between all participants
  const handleSplit = () => {
    console.log("payers: " + payers);

    // get all participants
    const allParticipants = getAllPeople(payers, selectedParticipants);
    console.log("all partisipants: " + allParticipants);

    console.log("total amount: " + totalAmount);

    // calculate share
    const share = calculateShare(totalAmount, payers, selectedParticipants);
    setShare(share);
    console.log("share: " + share.toFixed(2));

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

    // find nonoverpayers remaining amount
    const nonOverPayersRemainingAmount = calculateNonOverPayersRemainingAmount(
      nonOverPayers,
      share,
      event
    );

    setNonOverPayersShare(nonOverPayersRemainingAmount);
  };

  return (
    <div>
      <main>
        <h2 className="event-name">{event.name}</h2>
        <div className="participant-checkbox">
          <h4>Vælg dem du vil dele udgifterne med</h4>
          <div className="people-share-container">
            {event.participants.map((friend) => (
              <div key={friend} className="checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(friend)}
                    onChange={() => handlePersonToggle(friend)}
                    disabled={event.expenses.some((e) => e.payer === friend)}
                  />
                  <br />
                  {friend}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="expenselist">
          <h2>Udgiftsliste</h2>
          <div className="expense-list">
            {event.expenses.map((expense, index) => (
              <div key={index} className="expense-list-items">
                {expense.payer}: {expense.description} -{" "}
                <span style={{ color: "#ed6464" }}>
                  {expense.amount.toFixed(2)} kr.
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="total-amount-bar">
          <p>
            Samlede udgifter:{" "}
            <span style={{ color: "#ed6464" }}>
              {event.totalAmount.toFixed(2)} kr.
            </span>
          </p>
        </div>
        <br />
        <button className="split-button" onClick={handleSplit}>
          Del beløb
        </button>
        <br /> <br />
        <div className="due-amount">
          <h2>Regnskab</h2>
          <div className="share-per-person">
            <p>
              {"Udgift pr. person: "}
              <span style={{ color: "#ed6464" }}>
                {share.toFixed(2) + " kr."}
              </span>
            </p>
          </div>
          {overPayers.length > 0 && (
            <div className="account">
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
          {overPayers.length > 0 && (
            <div className="due-amount-owed-container">
              {nonOverPayers.map((nonOverPayer, nonOverPayerIndex) => (
                <div key={nonOverPayerIndex}>
                  <ul className="custom-list">
                    <li className="bold-debitor">{nonOverPayer} skylder: </li>
                    <br />
                    {overPayersAmount.map((amount, overPayerIndex) => (
                      <li key={overPayerIndex}>
                        {overPayers[overPayerIndex]}:{" "}
                        <span style={{ color: "#ed6464" }}>
                          {(
                            nonOverPayersShare[nonOverPayerIndex] *
                            (amount /
                              overPayersAmount.reduce((a, b) => a + b, 0))
                          ).toFixed(2)}{" "}
                          kr.
                        </span>
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
