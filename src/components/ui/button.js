// components/ui/button.js
import React from 'react';

export const Button = ({ children, onClick, disabled }) => {
  return (
    <button
      className={`px-4 py-2 text-white bg-blue-500 rounded ${
        disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
