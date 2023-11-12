import React, { useState } from 'react'
import coverPhoto from '../assets/coverphoto1.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../Components/AlertMessage';

export default function AdminLogin() {
  const history = useNavigate();
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    'username': '',
    'password': ''
  });
  
  const handleOnChange = (e) => {
    e.persist();
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const sendSignInPostRequest = (formData) => {
    axios.post('https://librarybackend.aldoiris.online/api/token/', formData)
      .then((response) => {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        history('/admin-dashboard');
      })
      .catch((error) => {
        console.warn('Error:', error);
        setError(true);
      });
  }
  const handleSignIn = (e) => {
    e.preventDefault();
    sendSignInPostRequest(formData);
  };

  return (
    <>
      <div className="container w-5/6 mx-auto my-3 justify-center flex flex-col">
        <img className='mx-auto md:w-3/6' src={coverPhoto} alt="library svg" />
        <div className='mx-auto w-full'>
          <h3 className=' text-lg font-semibold md:text-2xl'>Admin Login</h3>
          <form onSubmit={handleSignIn}>
            <input type="text" value={formData.username} name='username' onChange={handleOnChange} placeholder="Enter your username" className="my-3 input input-bordered w-full " /><br />
            <input type="password" onChange={handleOnChange} value={formData.email} name='password' placeholder="Enter your password" className="my-3 input input-bordered w-full   " />
            {error && <AlertMessage message='Please Check your username or password' />}
            <button className="btn">
              Login
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 17.625C14.9264 19.4769 13.3831 21.0494 11.3156 20.9988C10.8346 20.9871 10.2401 20.8194 9.05112 20.484C6.18961 19.6769 3.70555 18.3204 3.10956 15.2816C3 14.723 3 14.0944 3 12.8373L3 11.1627C3 9.90561 3 9.27704 3.10956 8.71845C3.70555 5.67963 6.18961 4.32314 9.05112 3.516C10.2401 3.18062 10.8346 3.01293 11.3156 3.00116C13.3831 2.95058 14.9264 4.52305 15 6.37499" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 12H21M10 12C10 11.2998 11.9943 9.99153 12.5 9.5M10 12C10 12.7002 11.9943 14.0085 12.5 14.5" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
