import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/Switch.css'

function PlusMinus() {
  const [Plus, setPlus] = useState(true); // true = ₹, false = %

  const handleToggle = () => {
  setPlus((prev) => !prev);
  };

  return (
    <div className="d-flex  align-items-center gap-2">
     

      <div className="custom-switch-toggle  border rounded-4 d-flex">
        <button
          type="button"
          onClick={() => setPlus(true)}
          className={`btn btn-sm ${
            Plus ? "btn-success" : "btn-outline-white"
          } rounded-4`}
        >
   +
        </button>
        <button
          type="button"
          onClick={() => setPlus(false)}
          className={`btn btn-sm ${
            !Plus ? "btn-success" : "btn-outline-white"
          } rounded-4`}
        >
          -
        </button>
      </div>

     
     
    </div>
  );
}

export default PlusMinus;
