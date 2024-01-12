// global - made to showcase. Used in Header.jsx
window.testId = 2;

function eventFacade() {
  let events = [
    {
      id: 1,
      name: "Test Begivenhed",
      expenses: [
        { description: "Mad", amount: 50.0 },
        { description: "Drikke", amount: 20.0 },
      ],
      totalAmount: 70.0,
    },
  ];

  let nextId = testId;

  const getEvents = () => {
    return events;
  };

  const findEvent = (id) => {
    return events.find((event) => event.id.toString() === id);
  };

  const addEvent = (event) => {
    try {
      if (!event.name || !event.expenses) {
        throw new Error("Begivenheden mangler påkrævede felter.");
      }

      event.id = nextId;
      nextId++;
      events.push(event);

      // Array of expenses reduced to a single value
      const totalExpenseAmount = event.expenses.reduce(
        // acc = accumulator starting at 0
        // expense = current value
        (acc, expense) => acc + parseFloat(expense.amount),
        0 // Initial value of the accumulator
      );

      if (isNaN(totalExpenseAmount)) {
        throw new Error("Ugyldigt beløb for en udgift");
      }

      event.totalAmount = parseFloat(totalExpenseAmount.toFixed(2));
    } catch (error) {
      console.error("Fejl ved tilføjelse af begivenhed:", error);
      throw error; // Rethrow error to whoever called addEvent
    }
  };

  return {
    getEvents,
    findEvent,
    addEvent,
  };
}

let returnVal = eventFacade();
export default returnVal;
