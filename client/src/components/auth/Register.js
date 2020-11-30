import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory }  from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import api             from "../../api";
import eye             from "../../assets/images/eye.svg";
import eyeSlash        from "../../assets/images/eye-slash.svg";




function Register(){
  const { user, setUser }                                = useContext(AuthContext);
  const history                                          = useHistory();
  const [email, setEmail]                                = useState('');
  const [password, setPassword]                          = useState('');
  const [passwordCheck, setPasswordCheck]                = useState('');
  const [displayName, setDisplayName]                    = useState('');
  const [passwordIsShown, setPasswordIsShown ]           = useState(false);
  const [passwordCheckIsShown, setPasswordCheckIsShown ] = useState(false);
  const emailRef                                         = useRef();
  const passwordRef                                      = useRef();
  const passwordCheckRef                                 = useRef();
  const displayNameRef                                   = useRef();


  useEffect(() => {
    let unmounted = false;
    if (!unmounted && user){ history.push("/"); }
    return () => { unmounted = true; }
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();


    /* ==========================
            Validation
    ========================== */


    if (!email || !password || !passwordCheck){
      setPassword('');
      setPasswordCheck('');
      alert("Please fill out all required fields.");
      return;
    }

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)){
      setPassword('');
      setPasswordCheck('');
      alert("Please use a valid email.");
      return;
    }

    if (password.length < 5){
      setPassword('');
      setPasswordCheck('');
      alert("Passwords must contain at least 5 characters.");
      return;
    }

    if (passwordCheck !== password){
      setPassword('');
      setPasswordCheck('');
      alert("Passwords must match.");
      return;
    }


    /* ==========================

    ========================== */


    try {
      const registrationData = { email, password, passwordCheck, displayName };
      const res              = await api.register(registrationData);
      const { msg }          = res.data;

      //Even though we will be redirecting, it's still a good idea to clear all this out.
      setEmail('');
      setPassword('');
      setPasswordCheck('');
      setDisplayName('');

      alert(msg);
      history.push("/login");
    }

    catch (err){
      console.log(err.response.data.error);
      alert(err.response.data.error);
    }
  };


  const handleShowPasswordClick = () => {
    try {
      if (!passwordIsShown){ passwordRef.current.type = "text"; }
      else { passwordRef.current.type = "password"; }
      setPasswordIsShown((value) => !value); //This has to be done last in order to trigger rerender.
    } catch(err){
      console.log(err);
    }
  };


  const handleShowCheckPasswordClick = () => {
    try {
      if (!passwordCheckIsShown){ passwordCheckRef.current.type = "text"; }
      else { passwordCheckRef.current.type = "password"; }
      setPasswordCheckIsShown((value) => !value); //This has to be done last in order to trigger rerender.
    } catch(err){
      console.log(err);
    }
  };


  return (
    <div>
      <h1 className="fancy-h1 my-5">Register</h1>


      <form
        className="mx-auto my-5 p-3 bg-white border border-dark rounded-lg shadow"
        style={{maxWidth: '600px'}}
        noValidate
      >

        <div className="form-group">
          <label className="font-weight-bold" onClick={() => emailRef.current.focus()}>Email <span>*</span></label>
          <input
            ref={emailRef}
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>


        <div className="form-group">
          <label className="font-weight-bold" onClick={() => passwordRef.current.focus()}>Password <span>*</span></label>

        <div style={{position:'relative'}}>
          <input
            ref={passwordRef}
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <img
            src={ passwordIsShown ? eyeSlash : eye }
            style={{
              position:'absolute',
              top: '50%',
              right: 10,
              transform:'translateY(-50%)',
              maxWidth: 25,
              cursor:'pointer'

            }}
            onClick={handleShowPasswordClick}
          />
        </div>

        </div>


        <div className="form-group">
          <label className="font-weight-bold" onClick={() => passwordCheckRef.current.focus()}>Confirm Password <span>*</span></label>

         <div style={{position:'relative'}}>
           <input
             ref={passwordCheckRef}
             className="form-control"
             type="password"
             value={passwordCheck}
             onChange={(e) => setPasswordCheck(e.target.value)}
           />

           <img
             src={ passwordCheckIsShown ? eyeSlash : eye }
             style={{
               position:'absolute',
               top: '50%',
               right: 10,
               transform:'translateY(-50%)',
               maxWidth: 25,
               cursor:'pointer'
             }}
             onClick={handleShowCheckPasswordClick}
           />
         </div>

        </div>


        <div className="form-group">
          <label className="font-weight-bold" onClick={() => displayNameRef.current.focus()}>Display Name</label>
          <input
            ref={displayNameRef}
            className="form-control"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>


        <button type="button" className="btn btn-primary btn-block" onClick={handleSubmit}>REGISTER</button>
      </form>
    </div>
  );
}


export default Register;
