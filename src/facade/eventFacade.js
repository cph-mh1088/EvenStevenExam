function eventFacade() {
  let events = [
    {
      id: 1,
      name: "Eksempel",
      expenses: [
        { description: "Smørrebrød", amount: 200.0, payer: "Far" },
        { description: "Kage", amount: 100.0, payer: "Mor" },
        { description: "Blomster", amount: 50.0, payer: "Ida" },
      ],
      totalAmount: 350,
      participants: ["Far", "Mor", "Ida", "Maria", "Laura", "Mikkel"],
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
    event.id = nextId;
    nextId++;
    event.participants = ["Far", "Mor", "Ida", "Maria", "Laura", "Mikkel"];
    events.push(event);

    const totalExpenseAmount = event.expenses.reduce(
      (acc, expense) => acc + parseFloat(expense.amount),
      0
    );
    event.totalAmount = parseFloat(totalExpenseAmount.toFixed(2));
  };

  return {
    getEvents,
    findEvent,
    addEvent,
  };
}

let returnVal = eventFacade();
export default returnVal;
