import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import Home from "./components/pages/Home";
import Events from "./components/pages/Events";
import EventDetails from "./util/EventDetails";
import Login from "./components/pages/Login";
import NoMatch from "./util/NoMatch";

function App() {
  // app name being send as a prop
  const appName = "EvenSteven";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout appName={appName} />}>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="begivenheder" element={<Outlet />}>
            <Route index element={<Events />} />
            <Route path="begivenhed/:id" element={<EventDetails />} />
          </Route>
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
