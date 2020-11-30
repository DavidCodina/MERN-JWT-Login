import React, { useEffect, useContext } from "react";
import { useHistory }                   from 'react-router-dom';
import { AuthContext }                  from "./context/authContext";
import Navigation                       from "./components/layout/Navigation";
import Routes                           from "./components/layout/Routes";
import api                              from "./api";
import './css/main.css';




function App(){
  const { user, setUser, setUserIsLoading } = useContext(AuthContext);
  const history           = useHistory();


  useEffect(() => {
    const checkLoggedIn = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken === null){
        return console.log("There was no accessToken in localStorage.");
      }


      try {
        setUserIsLoading(true);
        const res      = await api.getUserData();
        const { data } = res;

        setUser(data.user);
        setUserIsLoading(false);
      } catch (err){
        console.log("Unable to get user data. The refresh token probably expired. Setting user to null and redirecting to /login.");
        setUser(null);
        history.push("/login");
        setUserIsLoading(false);
      }
    }; //End of checkLoggedIn

    checkLoggedIn();


    //Optional: Check if user is logged in at intervals.
    setInterval(() => {
      checkLoggedIn(); }, 1000 * 60 * 10);
  }, [setUser]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <React.Fragment>
      <Navigation />
      <Routes />
    </React.Fragment>
  );
}


export default App;
