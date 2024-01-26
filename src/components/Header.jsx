import { useNavigate } from "react-router-dom";
import "../App.css";

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleHeaderTextClick = () => {
    navigate("/");
  };

  return (
    <div>
      <h1 className="header-text" onClick={handleHeaderTextClick}>
        <span className="header-text-even">{title.slice(0, 4)}</span>
        <span className="header-text-steven">{title.slice(4)}</span>
      </h1>
    </div>
  );
};

export default Header;
