import React, { useContext, useEffect } from 'react';
import { NavLink, useHistory }          from 'react-router-dom';
import { AuthContext }                  from "../../context/authContext";
import api                              from "../../api";
import axios from "axios";




const Navigation = () => {
  const { user, setUser } = useContext(AuthContext);
  const history           = useHistory(); //For buttons
  const handleRegister    = () => history.push("/register");
  const handleLogin       = () => history.push("/login");



  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const res          = await api.logout({ refreshToken });
      const { msg }      = res.data;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      alert(msg);
      history.push("/login");
    }

    catch (err){
      alert(err.response.data.error);
      console.error(err.response.data.error);
    }
  };


  const renderContent = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken){
      return (
        <nav className="d-flex align-items-center px-3">
          <NavLink className="link mr-3" activeClassName="active-link" exact to="/">Home</NavLink>
          <NavLink className="link mr-3" activeClassName="active-link" exact to="/account">Account</NavLink>
          <button className="btn btn-danger ml-auto" onClick={handleLogout}>Log out</button>
        </nav>
      );
    }

    return (
      <nav className="d-flex align-items-center px-3">
        <button className="btn btn-secondary mr-3 ml-auto" onClick={handleLogin}>Log in</button>
        <button className="btn btn-secondary" onClick={handleRegister}>Register</button>
      </nav>
    );
  };


  return (
    <React.Fragment>
      { renderContent() }
    </React.Fragment>
  )
};


export default Navigation;
