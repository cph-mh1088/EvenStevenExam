import "../App.css";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleHeaderTextClick = () => {
    navigate("/");
  };

  return (
    <div>
      <h1 className="header-text" onClick={handleHeaderTextClick}>
        {title}
      </h1>
    </div>
  );
};

export default Header;
