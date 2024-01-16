function eventFacade() {
  let events = [
    {
      id: 1,
      name: "Test Begivenhed",
      expenses: [
        { description: "Mad", amount: 50.0 },
        { description: "Drikke", amount: 20.0 },
      ],
      totalAmount: 999,
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
      // if (!event.name || !event.expenses) {
      //   throw new Error("...");
      // }

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
        throw new Error("");
      }

      event.totalAmount = parseFloat(totalExpenseAmount.toFixed(2));
    } catch (error) {
      console.error(error);
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
