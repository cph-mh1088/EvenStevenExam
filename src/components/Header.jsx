import "../App.css";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleHeaderClick = () => {
    navigate("/");
  };

  return (
    <div className="header" onClick={handleHeaderClick}>
      <header>
        <h1>
          <span className="blue-text">{title}</span>
        </h1>
      </header>
    </div>
  );
};

export default Header;
