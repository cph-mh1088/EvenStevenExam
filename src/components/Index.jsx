import eventFacade from "/src/facade/eventFacade.js";
import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

const Index = () => {
  const [amount, setAmount] = useState(""); // ongoing amount
  const [totalAmount, setTotalAmount] = useState(0); // total amount
  const [description, setDescription] = useState(""); // description of the expense
  const [expenseList, setExpenseList] = useState([]); // expense list
  const [eventName, setEventName] = useState(""); // event name
  const [selectedOption, setSelectedOption] = useState(""); // selected payer in dropdown

  const [showMessage, setShowMessage] = useState(false); // show message

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMessage(false);
    }, 4000);

    // Clean up function. Clear the timeout when the component unmounts or when showMessage is set to false
    return () => clearTimeout(timeout);
  }, [showMessage]);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleAddExpense = () => {
    if (amount !== "") {
      // create new expense object
      const newExpense = {
        amount: parseFloat(amount),
        description: description,
        payer: selectedOption,
      };

      // add the new expense to the expense list
      setExpenseList((prevExpenseList) => [...prevExpenseList, newExpense]);

      // convert the amount to float and add it to the total amount
      setTotalAmount((prevTotal) => prevTotal + parseFloat(amount));

      //reset the current input amount
      setAmount("");
      setDescription("");
    }
  };

  // handle changes in the input field for description
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);

    // clear error message when description is changed
    if (event.target.value !== "" && amount !== "") {
    }
  };

  const handleAddEvent = () => {
    try {
      if (!eventName) {
        console.log("Du skal navngive din begivenhed");
        return;
      }

      if (expenseList.length === 0) {
        console.log("Du skal tilføje mindst én udgift.");
        return;
      }

      // new event object
      const newEvent = {
        name: eventName,
        expenses: expenseList,
      };

      // add event to mock db
      eventFacade.addEvent(newEvent);
      setShowMessage(true);

      console.log("Begivenhed tilføjet:", newEvent);

      setEventName("");
      setExpenseList([]);
      setTotalAmount(0);
    } catch (error) {
      console.error("Fejl ved tilføjelse af begivenhed:");
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // prevent page from reloading
    handleAddEvent();
  };

  const handleDeleteExpense = (index) => {
    // remove the expense from the expense list
    const newExpenseList = expenseList.filter((expense, i) => i !== index);
    setExpenseList(newExpenseList);

    // subtract the amount from the total amount
    const deletedExpense = expenseList[index];
    setTotalAmount((prevTotal) => prevTotal - deletedExpense.amount);
  };

  return (
    <div>
      <main>
        <br />
        <h2>Her kan du tilføje en begivenhed med tilhørende udgifter</h2>
        <p>Efterfølgende kan du opdele udgifterne under begivenheden</p>
        <h2>Tilføj en begivenhed</h2>
        <input
          id="eventInput"
          type="text"
          placeholder="Indtast begivenhed"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <br />
        <h2>Tilføj udgifter</h2>
        <select
          id="expositorsDropdown"
          value={selectedOption}
          onChange={handleDropdownChange}
        >
          <option value="">Vælg udlægger</option>
          <option value="Far">Far</option>
          <option value="Mor">Mor</option>
          <option value="Ida">Ida</option>
          <option value="Maria">Maria</option>
          <option value="Laura">Laura</option>
          <option value="Mikkel">Mikkel</option>
        </select>
        <br />
        <br />
        <input
          id="descriptionInput"
          type="text"
          placeholder="Beskrivelse"
          value={description}
          onChange={handleDescriptionChange}
        />
        <br />
        <br />
        <input
          id="amountInput"
          type="number"
          placeholder="Indtast beløb"
          value={amount}
          onChange={handleAmountChange}
        />
        <br />
        <br />
        <button className="add-expense-button" onClick={handleAddExpense}>
          Tilføj udgift
        </button>
        <div>
          <h3>{eventName}</h3>
          <ul className="expenselist">
            {expenseList.map((expense, index) => (
              <li key={index} className="expense-item">
                {expense.description} ({expense.payer}):{" "}
                {expense.amount.toFixed(2)} kr.
                <button
                  className="delete-expense-button"
                  onClick={() => handleDeleteExpense(index)}
                >
                  Slet
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="total-amount-bar">
          <p>Samlede udgifter: {totalAmount.toFixed(2)} kr.</p>
        </div>
        <br />
        <br />
        <form onSubmit={handleFormSubmit}>
          <button type="submit" className="add-event-button">
            Gem begivenhed
          </button>
        </form>
        <p>Gå til begivenheder for opdeling</p>
        <Link to="/begivenheder" className="event-link">
          Begivenheder
        </Link>
        {showMessage ? (
          <p style={{ color: "green" }}>Begivenhed tilføjet!</p>
        ) : null}
      </main>
      <br />
      <br />
      <footer>
        <Link to={"/om"} className="about-link">
          Om EvenSteven
        </Link>
      </footer>
      <Outlet />
    </div>
  );
};

export default Index;
