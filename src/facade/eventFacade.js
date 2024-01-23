function eventFacade() {
  let events = [
    {
      id: 1,
      name: "Eksempel",
      expenses: [
        { description: "Mad", amount: 50.0, payer: "Far" },
        { description: "Drikke", amount: 20.0, payer: "Mikkel" },
      ],
      totalAmount: 70,
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

  const splitExpenses = (eventId) => {
    const event = findEvent(eventId);

    if (!event) {
      console.log("Event not found");
      return;
    }

    const payments = {};

    // For hver udgift, tilføj beløbet til betalernes gæld/opkrævning
    event.expenses.forEach((expense) => {
      const { payer, amount } = expense;
      payments[payer] = (payments[payer] || 0) + parseFloat(amount);
    });

    // Kald den tidligere splitPayments-funktion
    splitPayments(payments);
  };

  const splitPayments = (payments) => {
    const people = Object.keys(payments);
    const valuesPaid = Object.values(payments);

    const sum = valuesPaid.reduce((acc, curr) => curr + acc);
    const mean = sum / people.length;

    const sortedPeople = people.sort(
      (personA, personB) => payments[personA] - payments[personB]
    );
    const sortedValuesPaid = sortedPeople.map(
      (person) => payments[person] - mean
    );

    let i = 0;
    let j = sortedPeople.length - 1;
    let debt;

    while (i < j) {
      debt = Math.min(-sortedValuesPaid[i], sortedValuesPaid[j]);
      sortedValuesPaid[i] += debt;
      sortedValuesPaid[j] -= debt;

      console.log(`${sortedPeople[i]} skylder ${sortedPeople[j]} $${debt}`);

      if (sortedValuesPaid[i] === 0) {
        i++;
      }

      if (sortedValuesPaid[j] === 0) {
        j--;
      }
    }
  };

  return {
    getEvents,
    findEvent,
    addEvent,
    splitExpenses,
  };
}

let returnVal = eventFacade();
export default returnVal;
