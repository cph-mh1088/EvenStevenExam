import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import Home from "./components/pages/Home";
import Events from "./components/pages/Events";
import EventDetails from "./util/EventDetails";
import Login from "./components/pages/Login";

function App() {
  // app name being send as a prop
  const appName = "EvenSteven";

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout appName={appName} />}>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="begivenheder" element={<Events />} />
        <Route path="/begivenheder/begivenhed/:id" element={<EventDetails />} />
      </Route>
    )
  );

  return <RouterProvider router={routes} />;
}

export default App;
