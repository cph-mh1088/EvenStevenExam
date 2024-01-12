import "../App.css";
import { Outlet } from "react-router-dom";
import Header from "../components/pages/Header";

function MainLayout({ appName }) {
  return (
    <div id="main-layout">
      {/* Header component */}
      <Header appName={appName} /> {/* Send prop to header */}
      {/* Redering of components */}
      <Outlet />
    </div>
  );
}

export default MainLayout;
