import React, { createContext, useState } from "react";


export const AuthContext = createContext(null);


export const AuthProvider = (props) => {
  const [user, setUser ]                  = useState(null);
  const [userIsLoading, setUserIsLoading] = useState(false);
  return (
    <AuthContext.Provider value={{user, setUser, userIsLoading, setUserIsLoading }}>
      {props.children}
    </AuthContext.Provider>
  )
};


export const AuthConsumer = AuthContext.Consumer;
