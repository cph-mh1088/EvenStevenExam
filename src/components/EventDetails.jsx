import React, { useState } from "react";
import { useParams } from "react-router-dom";
import eventFacade from "/src/facade/eventFacade.js";

const EventDetails = () => {
  const { id } = useParams();
  const event = eventFacade.findEvent(id);
  const totalAmount = event.totalAmount;
  const payers = event.expenses.map((expense) => expense.payer);

  const [selectedParticipants, setSelectedParticipants] = useState([]); // valgte deltagere (ikke udlæggere)
  const [overPayers, setOverPayers] = useState([]); // udlæggere der har betalt mere end deres andel
  const [overPayersAmount, setOverPayersAmount] = useState([]); // beløbet en overpayer har betalt for meget
  const [nonOverPayers, setNonOverPayers] = useState([]); // deltagere der har betalt intet, mindre end eller præcis deres andel
  const [nonOverPayersShare, setNonOverPayersShare] = useState([]); // beløbet en nonOverPayer mangler at betale
  const [share, setShare] = useState(0); // andel pr. person

  const handlePersonToggle = (person) => {
    if (selectedParticipants.includes(person)) {
      // hvis personen allerede er valgt, fjern personen fra listen
      setSelectedParticipants(selectedParticipants.filter((f) => f !== person));
    } else {
      setSelectedParticipants([...selectedParticipants, person]);
    }
  };

  // find alle indblandede personer
  const getAllPeople = (payers, selected) => {
    return [...payers, ...selected];
  };

  // lav et objekt at alle involdverede og hvor meget de har betalt
  const getPeopleAndAmount = (allPeople, event) => {
    // gennemløb alle personer
    return allPeople.map((person) => {
      // find udgifter for hver person
      const personExpenses = event.expenses.filter((e) => e.payer === person);
      // find samlede udgifter for hver person
      const personTotal = personExpenses.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );
      // returner et objekt med personens navn og det beløb, de har betalt
      return { person, personTotal };
    });
  };

  // find hver persons andel
  const calculateShare = (totalAmount, payers, selected) => {
    // hvis ingen valgte delagere er valgt, del kun imellem udlæggere
    if (selected.length === 0) {
      return totalAmount / payers.length;
    } else {
      return totalAmount / (payers.length + selected.length);
    }
  };

  // find alle udlæggere der har betalt mere end deres andel
  const findOverPayers = (allPeople, event, share) => {
    // gennemløb alle personer
    return allPeople.filter((person) => {
      // find udgifter for hver person
      // bemærk at dette er et array af udgifter og derfor skal ændres til en numerisk værdi
      const personExpenses = event.expenses.filter((e) => e.payer === person);
      // find samlede udgifter for hver person som en numerisk værdi
      const personTotal = personExpenses.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );
      // returner true hvis personen har betalt mere end deres andel
      return personTotal > share;
    });
  };

  // find det beløb hver overpayer har betalt for meget
  const calculateOverPayersAmount = (overPayers, share, event) => {
    // gennemløb alle overpayers
    return overPayers.map((person) => {
      // find udgifter for hver person
      const personExpenses = event.expenses.filter((e) => e.payer === person);
      // find samlede udgifter for hver person
      const personTotal = personExpenses.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );
      // returner det beløb personen har betalt for meget
      return personTotal - share;
    });
  };

  // find dem der ikke har betalt noget, mindre end eller præcis deres andel
  const findNonOverPayers = (allPeople, overPayers) => {
    return allPeople.filter((person) => {
      return !overPayers.includes(person);
    });
  };

  // find ud af hvor meget hver nonOverPayer mangler at betale for at have betalt deres share
  const calculateNonOverPayersRemainingAmount = (
    nonOverPayers,
    share,
    event
  ) => {
    // Array til at opbevare de manglende betalinger for hver person
    const remainingPayments = [];

    // Find ud af hvem der har betalt noget, og hvem der har intet betalt
    const paidSomething = nonOverPayers.map((person) => {
      // Find udgifter for hver person
      const personExpenses = event.expenses.filter((e) => e.payer === person);
      // find samlede udgifter for hver person
      const personTotal = personExpenses.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );

      // print udgifter for hver person
      console.log("personTotal for " + person + ": " + personTotal);

      // Returner et objekt med personens navn og det beløb, de har betalt
      return { person, personTotal };
    });

    // print status for hver person
    console.log("paidSomething: ", paidSomething);

    // Hvis de har betalt noget, find ud af hvor meget de mangler, før de har betalt deres share
    paidSomething.forEach((paid) => {
      // find ud af hvor meget hver person mangler at betale
      const remainingPayment = share - paid.personTotal;
      // print hvor meget hver person mangler at betale
      console.log(`${paid.person} mangler at betale: ${remainingPayment}`);
      // Tilføj remainingPayment til arrayet
      remainingPayments.push(remainingPayment);
    });
    return remainingPayments;
  };

  // NOTE - what happens if a person has paid exactly their share? This could be a problem

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

    // find nonoverpayers remaining amount
    const nonOverPayersRemainingAmount = calculateNonOverPayersRemainingAmount(
      nonOverPayers,
      share,
      event
    );
    console.log(
      "non overpayers remaining amount: " + nonOverPayersRemainingAmount
    );
    setNonOverPayersShare(nonOverPayersRemainingAmount);
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
        {/* Efter knappen "Del beløb" */}
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
          {nonOverPayers.length > 0 && (
            <div className="missing-payment-container">
              <div className="overpayers-list">
                {nonOverPayers.map((nonOverPayer, index) => (
                  <div key={index} className="overpayer-amount">
                    {nonOverPayer} mangler at betale:{" "}
                    <span style={{ color: "#ed6464" }}>
                      {nonOverPayersShare[index].toFixed(2)} kr.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <br />
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
