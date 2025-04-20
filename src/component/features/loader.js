import React from "react";
import "../../styles/load.css"; // Import CSS untuk styling

const Loader = () => {
  return (
    <div className="three-body">
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
    </div>
  );
};

export default Loader;
