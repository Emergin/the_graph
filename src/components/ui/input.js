// components/ui/input.js
import React from 'react';

export const Input = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
    />
  );
};
