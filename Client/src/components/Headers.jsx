import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Headers = () => {

  const { userData } = useContext(AppContext)
  const naviagate = useNavigate();

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6'/>
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'Developer'}!<img className='w-8 aspect-square ' src={assets.hand_wave} alt="" /></h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our App</h2>
        <p className='mb-8 max-w-md'>Let's start with a quick product tour and we will have you up and running in no time!</p>
        <button onClick={() => naviagate('/login')} className='px-8 py-2 text-white font-semibold rounded-lg border border-gray-300 bg-gradient-to-r from-blue-400 to-pink-400 hover:from-blue-500 hover:to-pink-500 transition duration-300 shadow-md'>Get started</button>
    </div>
  )
}
export default Headers