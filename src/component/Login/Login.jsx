

import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import imag1 from "../../assets/amppa-logo.png"

function Login() {
  const navigate = useNavigate();
  
const dispatch = useDispatch();
  const [input, setInput] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cookies, setCookie] = useCookies(['token']);
  const [loading, setLoading] = useState(false);
  
  const handleChange = e => {
    setErrorMessage('');
    setSuccessMessage('');
    setInput({ ...input, [e.target.name]: e.target.value });
  };


  
 
  const formSubmitter = async e => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/login', input);
        if (response && response.data && response.data.token) {
            const token = response.data.token;
            console.log(`Token------>${token}`);
            setSuccessMessage('Success');
             setCookie('token', token, { path: '/' });
  dispatch(loginSuccess(token));
  navigate('/');
            // navigate('/');
            // setCookie('token', token, { path: '/' });
            
           
        } else {
            setErrorMessage('Invalid username or password');
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Error response:', error.response.data);
        setErrorMessage('Invalid username or password');
    }
};

  return (
    <>
    <div className="loginpage">
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div className="login100-pic js-tilt" data-tilt>
      <a href="" className="logo"> <img src={imag1} alt="logo" /></a>
            </div>
            <form className="login100-form validate-form" onSubmit={formSubmitter}>
              <span className="login100-form-title" >Login</span>
              {errorMessage && <div style={{ marginBottom: '10px', color: 'red' }}>{errorMessage}</div>}
              {successMessage && <div style={{ marginBottom: '10px', color: 'green' }}>{successMessage}</div>}
              <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                <input 
  className="input100" 
  type="text" 
  name="email" 
  placeholder="Email"   // change text here
  onChange={handleChange} 
/>

                <span className="focus-input100" />
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true" />
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-validate="Password is required">
                <input className="input100" type="password" name="password" placeholder="Password" onChange={handleChange} />
                <span className="focus-input100" />
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true" />
                </span>
              </div>
              <div className="container-login100-form-btn">
                <button className="login100-form-btn">Login</button>
              </div>
              {/* <div className="text-center p-t-12">
                <span className="txt1">Forgot</span>
                <a className="txt2" href="#">
                  Username / Password?
                </a>
              </div> */}
              {/* <div className="text-center p-t-136">
                <a className="txt2" href="#">
                  Create your Account
                  <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true" />
                </a>
              </div> */}
            </form>
            {/* {loading && <p>Loading...</p>} */}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Login;
