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
  const [nonOverPayersShare, setNonOverPayersShare] = useState([]); // amount each non-overpayer has to pay to each overpayer

  const [splitResult, setSplitResult] = useState([]); // result of split
  const [share, setShare] = useState(0); // share pr. person

  // find deltagere der der skal deles med og ikke har lagt ud.
  const handlePersonToggle = (person) => {
    if (selectedParticipants.includes(person)) {
      // Hvis personen allerede er valgt, fjern personen fra listen
      setSelectedParticipants(selectedParticipants.filter((f) => f !== person));
    } else {
      // Hvis personen ikke er valgt, tilføj personen til listen
      setSelectedParticipants([...selectedParticipants, person]);
    }
  };

  // find alle involverede personer
  const getAllPeople = (payers, selected) => {
    return [...payers, ...selected];
  };

  // find hver persons andel af udgifterne
  const calculateShare = (totalAmount, payers, selected) => {
    // if zero non-payers are selected, split between all payers
    if (selected.length === 0) {
      return totalAmount / payers.length;
    } else {
      return totalAmount / (payers.length + selected.length);
    }
  };

  // find dem der har betalt for meget
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

  // find ud af hvor meget hver person har betalt for meget
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

  // find dem der ikke har betalt for meget
  // mangler et tjek i tilfælde af at person har betalt sin andel
  // måske et anden navn? Det handler jo om at betale sin andel
  const findNonOverPayers = (allPeople, overPayers) => {
    return allPeople.filter((person) => {
      return !overPayers.includes(person);
    });
  };

  const handleSplit = () => {
    // se alle udlæggere
    console.log("payers: " + payers);

    // se alle deltagere
    const allParticipants = getAllPeople(payers, selectedParticipants);
    console.log("all partisipants: " + allParticipants);

    // se fulde udgiftsbeløb
    console.log("total amount: " + totalAmount);

    // find udgift pr. person
    const share = calculateShare(totalAmount, payers, selectedParticipants);
    setShare(share);
    console.log("share: " + share);

    // se dem der har betalt for meget
    const overPayers = findOverPayers(allParticipants, event, share);
    console.log("overpayers: " + overPayers);
    setOverPayers(overPayers);

    // se hvor meget hver overpayer har betalt for meget
    const overPayersAmount = calculateOverPayersAmount(
      overPayers,
      share,
      event
    );
    setOverPayersAmount(overPayersAmount);
    console.log("overpayers amount: " + overPayersAmount);

    // se dem der ikke er overpayers
    const nonOverPayers = findNonOverPayers(allParticipants, overPayers);
    setNonOverPayers(nonOverPayers);
    console.log("non overpayers: " + nonOverPayers);

    // se nonover beløb til overpayers
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
        <div className="expense-list">
          <h3>Udgiftsliste</h3>
          <ul>
            {event.expenses.map((expense, index) => (
              <li key={index}>
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
          <p>Hver deltager skal betale nedenstående beløb til udlægger</p>
          {/* Gennemløb overpayers amount og vis hvad de skyldes ud for deres navn */}
          {overPayers.length > 0 && (
            <div>
              <h4>Overpayers:</h4>
              <ul>
                {overPayers.map((overPayer, index) => (
                  <li key={index}>
                    {overPayer}: {overPayersAmount[index].toFixed(2)} kr.
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Gennemløb nonoverpayers amount og vis hvad de skylder til hver overpayer*/}
          {/* Der mangler at blive vist navnet på den overpayer som nonoverPayer skylder til */}

          {nonOverPayersShare.length > 0 && (
            <div>
              <h4>Non Overpayers Share:</h4>
              <ul>
                {nonOverPayersShare.map((amount, index) => (
                  <li key={index}>
                    {nonOverPayers[index]} skylder: {amount.toFixed(2)} kr.
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
