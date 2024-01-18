function eventFacade() {
  let events = [
    {
      id: 1,
      name: "Test Begivenhed",
      expenses: [
        { description: "Mad", amount: 50.0, payer: "Far" },
        { description: "Drikke", amount: 20.0, payer: "Mikkel" },
      ],
      totalAmount: 70,
      friends: ["Far", "Mor", "Ida", "Maria", "Laura", "Mikkel"],
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
      event.id = nextId;
      nextId++;
      event.friends = ["Far", "Mor", "Ida", "Maria", "Laura", "Mikkel"];
      events.push(event);

      // Beregn totalbeløbet for begivenheden
      const totalExpenseAmount = event.expenses.reduce(
        (acc, expense) => acc + parseFloat(expense.amount),
        0
      );

      if (isNaN(totalExpenseAmount)) {
        throw new Error("Invalid expense amount");
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
