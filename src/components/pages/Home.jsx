import { useState, useEffect } from "react";
import eventFacade from "/src/facade/eventFacade.js";
import { Link } from "react-router-dom";

const Home = () => {
  const [amount, setAmount] = useState(""); // ongoing amount
  const [totalAmount, setTotalAmount] = useState(0); // total amount
  const [description, setDescription] = useState(""); // description of the expense
  const [expenseList, setExpenseList] = useState([]); // expense list
  const [eventName, setEventName] = useState(""); // event name
  const [error, setError] = useState(null); // error message
  const [showMessage, setShowMessage] = useState(false); // show message

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMessage(false);
    }, 3000);

    // Clean up function. Clear the timeout when the component unmounts or when showMessage is set to false
    return () => clearTimeout(timeout);
  }, [showMessage]);

  // ---   Methods  ---
  // handle changes in the input field for amount
  const handleAmountChange = (event) => {
    setAmount(event.target.value);

    if (event.target.value !== "" && description !== "") {
      setError(null);
    }
  };

  //handle adddition of amount and description to the expense list
  const handleAddExpense = () => {
    // check if the amount is empty
    if (amount === "" || description === "") {
      setError("Du skal udfylde både beskrivelse og beløb");
      console.log("Du skal udfylde både beskrivelse og beløb");
      return;
    }

    if (amount !== "") {
      // create new expense object
      const newExpense = {
        amount: parseFloat(amount),
        description: description,
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
      setError(null);
    }
  };

  const handleAddEvent = () => {
    try {
      if (!eventName) {
        setError("Du skal navngive din begivenhed");
        console.log("Du skal navngive din begivenhed");
        return;
      }

      if (expenseList.length === 0) {
        setError("Du skal tilføje mindst én udgift.");
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
      setError(null);
    } catch (error) {
      setError("Der skete en fejl ved tilføjelse af begivenhed.");
      console.error("Fejl ved tilføjelse af begivenhed:", error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // prevent page from reloading
    handleAddEvent();
  };

  return (
    <div>
      <main>
        <br></br>
        <h2>Her kan du tilføje en begivenhed med tilhørende udgifter</h2>
        <p>Efterfølgende kan du opdele udgifterne under begivenheden</p>
        {/* ---   input fields   --- */}
        <input
          id="eventInput"
          type="text"
          placeholder="Indtast begivenhed"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <br></br>
        <br></br>
        <input
          id="descriptionInput"
          type="text"
          placeholder="Beskrivelse"
          value={description}
          onChange={handleDescriptionChange}
        />
        <br></br>
        <br></br>
        <input
          id="amountInput"
          type="number"
          placeholder="Indtast beløb"
          value={amount}
          onChange={handleAmountChange}
        />
        <br></br>
        <br></br>
        {/* ---   buttons in order   --- */}
        {/* button for adding expense */}
        <button className="add-expense-button" onClick={handleAddExpense}>
          Tilføj udgift
        </button>
        {/* Show expense list */}
        <div>
          <h3>{eventName}</h3>
          <ul className="expense-list">
            {expenseList.map((expense, index) => (
              <li key={index} className="expense-item">
                {expense.description}: {expense.amount.toFixed(2)} kr.
              </li>
            ))}
          </ul>
        </div>
        {/* display the total amount */}
        <div className="total-amount-bar">
          <p>Samlede udgifter: {totalAmount.toFixed(2)} kr.</p>
        </div>
        <br></br>
        <br></br>
        <form onSubmit={handleFormSubmit}>
          <button type="submit" className="add-event-button">
            Gem begivenhed
          </button>
        </form>
        <p>Gå til begivenheder for opdeling</p>
        {/* Routing links */}
        <Link to="begivenheder" className="event-link">
          Begivenheder
        </Link>
        {/* Show messages */}
        {showMessage ? (
          <p style={{ color: "green" }}>Begivenhed tilføjet!</p>
        ) : null}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </main>
      <br></br>
      <footer>
        <div className="flex-container-admin">
          <div className="flex-conterin-children">
            <p>kontakt admin på tlf:. 12345678</p>
            <Link to="/login" className="footer-login-link">
              Log ind
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
