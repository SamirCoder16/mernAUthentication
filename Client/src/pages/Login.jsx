import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';


const Login = () => {

  const navigate = useNavigate();

  const { backendUrl, setisLoggedIn, getUserData} = useContext(AppContext)
  
  const [state, setstate] = useState('Sign Up')
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;

    try {
      if(state === 'Sign Up'){
        const { data } =  await axios.post(backendUrl + '/api/auth/register', {
          name,
          email,
          password
        })
        if(data.success){
          setisLoggedIn(true)
          getUserData();
          navigate('/');
        }else{
          toast.error(data.message)
        }
      }else{
        const { data } = await axios.post(backendUrl + '/api/auth/login', {
          email,
          password
        })
        if(data.success){
          setisLoggedIn(true)
           getUserData();
          navigate('/');
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }

    setname('')
    setemail('')
    setpassword('')
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
        <img onClick={()=> navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
        <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
            <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
            <p className='text-center mb-6 text-sm'>{state === 'Sign Up' ? 'Create your Account' : 'Login to your Account'}</p>
            <form onSubmit={(e)=>{
              submitHandler(e)
            }}>
              {state === 'Sign Up' && (
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.person_icon} alt="" />
                <input
                 value={name}
                 onChange={(e)=>{
                  setname(e.target.value)
                 }}
                className='bg-transparent outline-none' required type="text" placeholder='Full Name'/>
              </div>
              )}
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.mail_icon} alt="" />
                <input
                 value={email}
                 onChange={(e)=>{
                  setemail(e.target.value)
                 }}
                 className='bg-transparent outline-none' required type="email" placeholder='Email id'/>
              </div>
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.lock_icon} alt="" />
                <input 
                value={password}
                onChange={(e)=>{
                  setpassword(e.target.value)
                }}
                className='bg-transparent outline-none' required type="password" placeholder='Password'/>
              </div>
              <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password ?</p>
              <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white'>{state}</button>
            </form>
            {state === 'Sign Up' ? (  <p className='text-gray-400 text-center text-xs mt-4'>Already have an Account ? {' '}
              <span onClick={()=> setstate('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
            </p>) : ( <p className='text-gray-400 text-center text-xs mt-4'>Don't have an Account ? {' '}
              <span onClick={()=> setstate('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
            </p>)}
        </div>
    </div>
  )
}

export default Login