import axios from "axios";
const baseUrl = "http://localhost:5000/api";


/* =============================================================================

============================================================================= */
//Request interceptor to add the x-auth-token header to all requests.


axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken){ config.headers["x-auth-token"] = accessToken; }
    return config;
  },
  (error) => { Promise.reject(error); }
);


/* =============================================================================

============================================================================= */
////////////////////////////////////////////////////////////////////////////////
//
//  This is the response interceptor. It checks for 401 responses.
//  It automates failed responses such that if they fail for a 401, then it automatically retries
//  However, there has to be some sort of system in place to prevent an infinite loop.
//  In this case, we are looking specifically for a status of 401 plus a msg of "AccessTokenExpiredError".
//  (Note: the specific implementation will depend on how the server's error responses have been set up)
//
//  In such cases we call /refresh_access_token. However, if that fails we do this:
//
//      localStorage.removeItem('accessToken');
//      localStorage.removeItem('refreshToken');
//      return Promise.reject(err);
//
//
//  The err ends up getting returned to the original place that made the call
//  For example in App.js:
//
//    const res = await api.getUserData();
//
//
//  Provided their is a try / catch, the err will then trigger that catch, and
//  do whatever the catch want to do with it.
//
////////////////////////////////////////////////////////////////////////////////


axios.interceptors.response.use(
  (res) => { return res; },

  (err) => {
    let refreshToken      = localStorage.getItem("refreshToken");
    const originalRequest = err.config;


    if (refreshToken && err.response.status === 401 && (err.response.data.error === "AccessTokenExpiredError") && !originalRequest._retry){
      originalRequest._retry = true; //What does this do?

      console.log("\nThe accessToken has expired. Attempting to refresh accessToken.\n");


      return axios.post(`${baseUrl}/auth/refresh_access_token`, { refreshToken: refreshToken })
        .then((res) => {

          if (res.status === 200){
            console.log("\nrefreshToken was still valid. Updating accessToken in localStorage.\n");

            localStorage.setItem("accessToken", res.data.accessToken);
            return axios(originalRequest);
          }
        })

        .catch((err) => {
          console.log("\n\nRefreshing the accessToken failed. Presumably because the refreshToken has expired.");
          //Note: if you want to be extra certain you can check for "RefreshTokenExpiredError".
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          return Promise.reject(err);
        });
    }

    return Promise.reject(err);
  }
);


/* =============================================================================

============================================================================= */



const api = {
  register: (data) => {
    return axios.post(`${baseUrl}/auth/register`, data);
  },

  login: (data) => {
    return axios.post(`${baseUrl}/auth/login`, data);
  },

  refreshToken: (data) => {
    return axios.post(`${baseUrl}/auth/refresh_token`, data);
  },

  logout: (data) => {
    const config = { data: data };
    return axios.delete(`${baseUrl}/auth/logout`, config);
  },

  getUserData: () => {
    return axios.get(`${baseUrl}/user`);
  }
};


/* =============================================================================

============================================================================= */


export default api;
