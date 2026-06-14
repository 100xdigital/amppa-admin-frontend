

import React from 'react'
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
function deleteCookie(cookieName) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function Logout({ show,onClose }) {
  
    const navigate  = useNavigate();
    const [logout, setLogout] = useState(false);
    const [cookies , removeCookie] = useCookies(['token']);

    useEffect(() => {
      const checkAuth = () => {
          if (!cookies.token) {
              navigate('/login');
          }
      };
      checkAuth();
  }, [logout]); // Include cookies.token and navigate in the dependency array
  
      const logoutHandler = (e) => {
        
        e.preventDefault();
        deleteCookie("token");
        // removeCookie("token"); // Use removeCookie to remove the token cookie
        setLogout(true);
        onClose(); // Close the modal if needed
        navigate('/login');
        window.location.reload();
       

    };
  
    return (
        show && (
          <div className='logout-modal'>
            <div className='modal-content'>
              <p>Are you sure you want to logout?</p>
          <div className='buttons'>
          <button className="logout" onClick={logoutHandler}>Logout</button>
              <button className="cancel" onClick={onClose}>Cancel</button>
          </div>
            
            </div>
          </div>
        )
      );
  
}

export default Logout