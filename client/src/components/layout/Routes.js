import React             from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import Home              from "../pages/Home";
import Account           from "../pages/Account";
import Login             from "../auth/Login";
import Register          from "../auth/Register";




const Routes = (props) => {
  const accessToken = localStorage.getItem("accessToken");

  return (
    <Switch>
      <Route exact path="/">{ accessToken ? <Home /> : <Login /> }</Route>
      <Route exact path="/account">{ accessToken ? <Account /> : <Login /> }</Route>
      <Route path="/login"    component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  )
};


export default Routes;
