import "../../App.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Header = ({ appName }) => {
  const navigate = useNavigate();

  const handleHeaderClick = () => {
    navigate("/");
    console.log(window.testId);
  };

  return (
    <div className="header" onClick={handleHeaderClick}>
      <header>
        <h1>
          <span className="blue-text">{appName}</span>
        </h1>
      </header>
    </div>
  );
};

// Specify prop types. Used for ESLint.
Header.propTypes = {
  appName: PropTypes.string.isRequired,
};

export default Header;
