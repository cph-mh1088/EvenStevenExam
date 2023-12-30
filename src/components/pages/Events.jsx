import "/Users/mikkel/Documents/GitHub/EvnStvn/EvnStvn/src/App.css";
import eventFacade from "/src/facade/eventFacade.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null); // Ny fejltilstand

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await eventFacade.getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        setError("Fejl ved hentning af begivenheder"); // Vis fejlbesked
        console.error("Fejl ved hentning af begivenheder:", error);
      }
    };

    fetchEvents();
  }, []); // Tomt array som andet argument til useEffect. Kører kun ved mount

  return (
    <div>
      <main>
        <br></br>
        <h2>Begivenheder</h2>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div className="Events-container">
            <div className="Events-body">
              {events.map((event) => (
                <div key={event.id} className="Event-row">
                  <Link
                    to={`/begivenheder/begivenhed/${event.id}`}
                    className="event-link"
                  >
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
