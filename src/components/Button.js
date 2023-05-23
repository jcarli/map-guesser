import PropTypes from "prop-types";

const Button = ({ text, disabled, onClick }) => {
  return (
    <button disabled={disabled} onClick={onClick} className="btn">
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  navigate: PropTypes.bool,
};

Button.defaultProps = {
  navigate: false,
};

export default Button;
