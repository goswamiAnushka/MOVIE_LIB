import React from "react";

const NoDataFound = ({ text }) => {
  return (
    <div className="no-data-found">
      <h1>{text}</h1>
    </div>
  );
};

export default NoDataFound;
