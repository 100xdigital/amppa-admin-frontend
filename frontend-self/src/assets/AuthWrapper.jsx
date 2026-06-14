

// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCookies } from 'react-cookie';

// const AuthWrapper = ({ children }) => {
//   const navigate = useNavigate();
//   const [cookies] = useCookies(['token']);

//   // Check if the user is authenticated
//   const isAuthenticated = !!cookies.token;

//   useEffect(() => {
//     console.log('AuthWrapper: isAuthenticated:', isAuthenticated);
//     if (!isAuthenticated) {
//       console.log('AuthWrapper: Redirecting to login page');
//       navigate('/login');
//     } else {
//       console.log('AuthWrapper: Redirecting to home page');
//       navigate('/');
//     }
//   }, [isAuthenticated, navigate]);

//   return isAuthenticated ? children : null;
// };

// export default AuthWrapper;

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AuthWrapper = ({ element, ...rest }) => {
  const [cookies] = useCookies(['token']);
  const isAuthenticated = !!cookies.token;

  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/login" replace />}
    />
  );
};

export default AuthWrapper;
