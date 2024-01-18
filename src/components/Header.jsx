import "../App.css";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleHeaderTextClick = () => {
    navigate("/");
  };

  return (
    <div className="header">
      <header>
        <h1 className="header-text" onClick={handleHeaderTextClick}>
          {title}
        </h1>
      </header>
    </div>
  );
};

export default Header;
