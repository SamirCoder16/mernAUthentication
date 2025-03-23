import React from 'react'
import Navbar from '../components/Navbar'
import Headers from '../components/Headers'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 bg-cover bg-center'>
        <Navbar />
       <div className='h-full w-full flex flex-col items-center justify-center md:mt-32 sm:mt-20'>
       <Headers />
       </div>
        <Footer />
    </div>
  )
}

export default Home