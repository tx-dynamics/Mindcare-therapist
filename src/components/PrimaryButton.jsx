import React from 'react';

const PrimaryButton = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        w-full bg-teal-700 text-white font-semibold py-3 rounded-lg
        hover:bg-teal-800 transition duration-200 ease-in-out
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
