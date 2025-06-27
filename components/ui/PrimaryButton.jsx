import React from "react";
import PropTypes from "prop-types";

const PrimaryButton = ({ label, onClick, type = "button", ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      {...rest}
    >
      {label}
    </button>
  );
};

PrimaryButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default PrimaryButton; 