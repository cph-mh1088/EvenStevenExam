import eventFacade from "/src/facade/eventFacade.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await eventFacade.getEvents();
      setEvents(fetchedEvents);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <main>
        <br />
        <h2>Begivenheder</h2>
        <div>
          <div className="events-body">
            {events.map((event) => (
              <div key={event.id} className="Event-row">
                <Link to={`begivenhed/${event.id}`} className="event-link">
                  {event.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <br />
    </div>
  );
};

export default Events;
