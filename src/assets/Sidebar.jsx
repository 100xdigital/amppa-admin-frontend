import React from 'react'
import { useSelector } from 'react-redux';
import 
{BsScissors, BsGrid1X2Fill, BsGrid, BsWindowDock , BsPerson , BsMenuButtonWideFill, BsFillGearFill}

 from 'react-icons/bs'
 import { Link,useLocation  } from 'react-router-dom';
 import { GrBlog } from "react-icons/gr";
 import { IoCloseCircleOutline } from "react-icons/io5";

  import imag1 from "../assets/amppa-logo.png"
 
 function Sidebar({ isVisible,toggleSidebar  }) {
  const role=useSelector(state=>state.auth.role);
  const location = useLocation();

  const isActive = (pathname) => {
    return location.pathname === pathname;
  };


  return (
    <div className={`sidebar ${isVisible ? 'actives' : ''}`} >
     <div id="mobside">
      <IoCloseCircleOutline className="close-btn" onClick={toggleSidebar} id="close" />
     
  <img src="images/logo.png" alt="logo" className="logo1"/>
  <ul className="list-unstyled components mb-5 sideul mobul">
{(role === 'admin' || role === 'manager') && (
    <li className={isActive('/') ? 'active' : ''} >
    <Link to="/"> <GrBlog   className='icon'/> Blog</Link>
    </li>
    
     )}
     {/* {(role === 'admin' || role === 'manager') && (
    <li className={isActive('/product') ? 'active' : ''} >
    <Link to="/product"> <GrBlog   className='icon'/> Product</Link>
    </li>
    
     )} */}
       {(role === 'admin' || role === 'manager') && (
    <li className={isActive('/Offers') ? 'active' : ''} >
    <Link to="/Offers"> <GrBlog   className='icon'/> Offers</Link>
    </li>
    
     )}
         {role === 'admin' && (
    <li className={isActive('/admin') ? 'active' : ''} >
    <Link to="/admin"> <BsPerson  className='icon'/> Admin</Link>
    </li>
       )}
  </ul>
  <div className="footer">
    <p>
      Copyright © All rights reserved  <i className="icon-heart" aria-hidden="true" /> by <a href="" target="_blank">Rainbowmedia</a>
    </p>
  </div>
  </div>
  <nav id="sidebar" className='active  fixed-sidebar'>
  {/* <a href="" className="logo"> <img src="images/logo.png" alt="logo" /></a> */}
      <a href="" className="logo"> <img src={imag1} alt="logo" /></a>
  
  <ul className="list-unstyled components mb-5 sideul">
{(role === 'admin' || role === 'manager') && (
    <li className={isActive('/') ? 'active' : ''} >
    <Link to="/"> <GrBlog   className='icon'/> Blog</Link>
    </li>
     )}
       {/* {(role === 'admin' || role === 'manager') && (
    <li className={isActive('/product') ? 'active' : ''} >
    <Link to="/product"> <GrBlog   className='icon'/> Product</Link>
    </li>
    
     )} */}
        {(role === 'admin' || role === 'manager') && (
    <li className={isActive('/Offers') ? 'active' : ''} >
    <Link to="/Offers"> <GrBlog   className='icon'/> Offers</Link>
    </li>
    
     )}
         {role === 'admin' && (
    <li className={isActive('/admin') ? 'active' : ''} >
    <Link to="/admin"> <BsPerson  className='icon'/> Admin</Link>
    </li>
       )}
   
    
  </ul>
  <div className="footer">
    <p>
      Copyright © All rights reserved  <i className="icon-heart" aria-hidden="true" /> by <a href="" target="_blank">Rainbowmedia</a>
    </p>
  </div>
</nav>
</div>
   
  )
}



export default Sidebar
