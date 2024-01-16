import eventFacade from "/src/facade/eventFacade.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // async function
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await eventFacade.getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        setError("Fejl ved hentning af begivenheder");
        console.error("Fejl ved hentning af begivenheder:", error);
      }
    };

    // call async function
    fetchEvents();
  }, []);

  return (
    <div className="flex-container">
      <main className="flex-items">
        <br></br>
        <h2>Begivenheder</h2>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div className="Events-container">
            <div className="Events-body">
              {events.map((event) => (
                <div key={event.id} className="Event-row">
                  <Link to={`begivenhed/${event.id}`} className="event-link">
                    {event.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <br></br>
      <footer>
        <div className="flex-container-admin">
          <div>
            <p>kontakt admin på tlf:. 12345678</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Events;
