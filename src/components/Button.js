import PropTypes from "prop-types";
import Link from "next/link";

const Button = ({ text, path, data, disabled, onClick }) => {
  return (
    <Link
      href={{
        pathname: path,
        query: JSON.stringify(data), // the data
      }}
    >
      <button disabled={disabled} onClick={onClick} className="btn">
        {text}
      </button>
    </Link>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
