import React from 'react';
import {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}from 'react-icons/bs';
import Logout from './Logout';
import { useState } from 'react';
import Sidebar from './Sidebar';

// import Dropdown from 'react-bootstrap/Dropdown';

function Header() {

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  const logoutHandler = () => {
    // Your logout logic here
    localStorage.removeItem('auth');
    setShowLogoutModal(false);
  };
  const [isSidebarVisible, setSidebarVisibility] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisibility(!isSidebarVisible);
  };
  return (
    <>
<nav className="navbar navbar-expand-lg navbar-light bg-light sticky-header">
  <div className="container-fluid">
    <button type="button" id="sidebarCollapse" className="btn btn-primary" onClick={toggleSidebar} >
      <i className="fa fa-bars" />
      <span className="sr-only">Toggle Menu</span>
    </button>

    <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <i className="fa fa-bars" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="nav navbar-nav ml-auto profile">
        <li className="nav-item active">
    
        <BsPersonCircle className='icon'onClick={toggleLogoutModal} style={{cursor:'pointer',fontSize:'35px'}}/>  
        <Logout show={showLogoutModal} onClose={toggleLogoutModal} onLogout={logoutHandler}  />
    
        </li>
       
      </ul>
    </div>
  </div>
</nav>
<Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />


    </>
  )
}

export default Header