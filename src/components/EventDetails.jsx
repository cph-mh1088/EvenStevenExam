import React, { useState } from "react";
import { useParams } from "react-router-dom";
import eventFacade from "/src/facade/eventFacade.js";

const EventDetails = () => {
  const { id } = useParams();
  const event = eventFacade.findEvent(id);

  const [splitResult, setSplitResult] = useState([]); // result of split
  const [overPayer, setOverPayer] = useState([]); // result of split

  const [selectedPeople, setSelectedPeople] = useState([]); // chosen people to split with

  const handlePersonToggle = (person) => {
    if (selectedPeople.includes(person)) {
      // Hvis personen allerede er valgt, fjern personen fra listen
      setSelectedPeople(selectedPeople.filter((f) => f !== person));
    } else {
      // Hvis personen ikke er valgt, tilføj personen til listen
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  const handleSplit = () => {
    // have fat i det totale beløb
    const totalAmount = event.totalAmount;

    // have fat i udlæggere
    const payers = event.expenses.map((e) => e.payer);

    console.log("Payers: " + payers);

    // have fat i de valgte personer
    const selected = selectedPeople;

    console.log("Selected: " + selected);

    // dele det totale beløb med antal personer. både payers og selected
    const share = totalAmount / (payers.length + selected.length);

    // log hvor meget hver person skal betale
    console.log("Share " + share);

    // lav en liste af både payers og selected
    const allPeople = [...payers, ...selected];

    console.log("All people: " + allPeople);

    // find ud af hvem der har betalt mere end deres share
    const overPayers = allPeople.filter((person) => {
      const personExpenses = event.expenses.filter((e) => e.payer === person);
      const personTotal = personExpenses.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );
      return personTotal > share;
    });

    setOverPayer(overPayers);

    // log overpayers
    console.log("Overpayers: " + overPayers);

    // find ud af hvor meget far og mikkel individuelt har betalt over deres share
    const overPayersAmount = overPayers.map((person) => {
      const personExpenses = event.expenses.filter((e) => e.payer === person);
      const personTotal = personExpenses.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );
      return personTotal - share;
    });

    // log overpayersAmount og vis hvem der skyldes hvad
    console.log("OverpayersAmount: " + overPayersAmount);

    // del overpyersamount for hver overpayer med seleceted
    const split = overPayersAmount.map((amount) => {
      return amount / selected.length;
    });

    // log split
    console.log("Split: " + split);

    setSplitResult(split);

    // jeg vil gerne have at split bliver vist på brugergrænsefladen
    // jeg vil gerne have at overpayersAmount bliver vist på brugergrænsefladen
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
                    checked={
                      selectedPeople.includes(friend) ||
                      event.expenses.some((e) => e.payer === friend) // kryds af hvis personen er en udlægger
                    }
                    onChange={() => handlePersonToggle(friend)}
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
        {splitResult.length > 0 && selectedPeople.length > 0 && (
          <div className="split-result">
            <h3>Opdeling:</h3>
            <p>Hver obs. på rækkefølgen Hver person skal betale følgende:</p>
            <ul>
              {splitResult.map((amount, index) => (
                <li key={index}>
                  {overPayer[index]}: {amount.toFixed(2)} kr.
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <br />
      <footer></footer>
    </div>
  );
};

export default EventDetails;

// problemer:
// man kan ikke kun dele mellem overpayers
// der deles kun mellem index antal?
