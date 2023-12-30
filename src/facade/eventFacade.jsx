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

  let nextId = 2;

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

      // Beregn det samlede beløb for udgifterne i den nye begivenhed

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

      // Gem det samlede beløb for udgifterne som totalAmount for begivenheden
      event.totalAmount = parseFloat(totalExpenseAmount.toFixed(2));
    } catch (error) {
      console.error("Fejl ved tilføjelse af begivenhed:", error);
      // Kast fejlen videre, så den kan håndteres i komponenten, der kalder addEvent
      // da fejlen er forbundet med brugerinput
      throw error; // Kast fejlen videre, så den kan håndteres i komponenten, der kalder addEvent
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
