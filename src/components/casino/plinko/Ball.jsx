import React from "react";

const Ball = ({ x, y, radius, refHeight, refWidth }) => {
  return (
    <div
      className="bg-red-500 absolute rounded-full shadow-sm"
      style={{
        top: `${((y - radius) / refHeight) * 100}%`,
        left: `${((x - radius) / refWidth) * 100}%`,
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: "50%",
      }}
    />
  );
};

export default Ball;