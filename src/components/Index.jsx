import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import eventFacade from "/src/facade/eventFacade.js";

const Index = () => {
  const [amount, setAmount] = useState(""); // ongoing amount
  const [totalAmount, setTotalAmount] = useState(0); // total amount
  const [description, setDescription] = useState(""); // description of the expense
  const [expenseList, setExpenseList] = useState([]); // expense list
  const [eventName, setEventName] = useState(""); // event name
  const [selectedOption, setSelectedOption] = useState(""); // selected payer in dropdown
  const [showMessage, setShowMessage] = useState(false); // show succes message
  const [showError, setShowError] = useState(false); // show error message
  const [errorMessage, setErrorMessage] = useState(""); // error message

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMessage(false);
      setShowError(false);
    }, 5000);

    // clean up function by unmount or dependency change
    return () => clearTimeout(timeout);
  }, [showMessage, showError]);

  const handleAmountChange = (event) => {
    // regex to limit input to 2 decimals
    const regex = /^\d+(\.\d{0,2})?$/;
    if (regex.test(event.target.value) || event.target.value === "") {
      setAmount(event.target.value);
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleAddExpense = () => {
    if (amount === "" || description === "" || selectedOption === "") {
      setErrorMessage(
        "En udgift skal have en udlægger, beskrivelse og et beløb"
      );
      setShowError(true);
      return;
    }

    if (amount !== "") {
      // create new expense object
      const newExpense = {
        amount: parseFloat(amount),
        description: description,
        payer: selectedOption,
      };

      setExpenseList((prevExpenseList) => [...prevExpenseList, newExpense]);

      setTotalAmount((prevTotal) => prevTotal + parseFloat(amount));

      setAmount("");
      setDescription("");
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAddEvent = () => {
    try {
      if (!eventName) {
        setErrorMessage("Du skal navngive din begivenhed");
        setShowError(true);
        return;
      }

      if (expenseList.length === 0) {
        setErrorMessage("Du skal tilføje mindst én udgift.");
        setShowError(true);
        return;
      }

      // new event object
      const newEvent = {
        name: eventName,
        expenses: expenseList,
      };

      eventFacade.addEvent(newEvent);
      setShowMessage(true);

      setEventName("");
      setExpenseList([]);
      setTotalAmount(0);
    } catch (error) {
      console.error("Fejl ved tilføjelse af begivenhed:", error);
      setErrorMessage("Der opstod en fejl ved tilføjelse af begivenhed");
      setShowError(true);
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
    <div className="index-page">
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
          type="text"
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
          <div className="expense-container">
            {expenseList.map((expense, index) => (
              <div key={index} className="expense-item">
                {expense.description} ({expense.payer}):{" "}
                {expense.amount.toFixed(2)} kr.{" "}
                <button
                  className="delete-expense-button"
                  onClick={() => handleDeleteExpense(index)}
                >
                  Slet
                </button>
              </div>
            ))}
          </div>
        </div>
        {showError && <p style={{ color: "red" }}>{errorMessage}</p>}
        <div className="total-amount-bar">
          <p>Samlede udgifter: {totalAmount.toFixed(2)} kr.</p>
        </div>
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
      <Outlet />
    </div>
  );
};

export default Index;
