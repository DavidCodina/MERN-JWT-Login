import React from "react";
import './spinner.css';


function Spinner(){
  return (
    <div className="spinner-modal">
      <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  );
}


export default Spinner;
