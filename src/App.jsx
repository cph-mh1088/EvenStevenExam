import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Index from "./components/Index";
import Events from "./components/Events";
import EventDetails from "./components/EventDetails";
import NoMatch from "./components/NoMatch";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Header title="EvenSteven" />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="begivenheder" element={<Outlet />}>
            <Route index element={<Events />} />
            <Route path="begivenhed/:id" element={<EventDetails />} />
          </Route>
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
