import React, { useContext, useEffect } from "react";
import { useHistory }                   from "react-router-dom";
import { AuthContext }                  from "../../context/authContext";
import Spinner                          from '../spinner/Spinner';




function Account(){
  const { user, userIsLoading } = useContext(AuthContext);
  const history                 = useHistory();


  const renderContent = () => {
    if (userIsLoading){
      return <Spinner />;
    }
    if (user && user.displayName){
      return <h2 className="my-5 fancy-h2 text-center">Account page for {user.displayName}</h2>;
    }
  };


  return (
    <div className="page">
      <h1 className="fancy-h1 my-5">Account</h1>
      { renderContent() }
    </div>
  );
}


export default Account;
