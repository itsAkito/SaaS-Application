import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {useClerk,UserButton ,useUser}from '@clerk/clerk-react'
const Navbar = () => {
  const navigate = useNavigate()
  const {user}=useUser()
  const {openSignIn}=useClerk()
  return (
    <div className='bg-gray-200 fixed z-5 w-full backdrop-blur-2xl flex item-center text-center justify-between py-3 px-4 sm:px-20 xl:px-32'>
      <img src={assets.logo} alt='' className='w-32 sm:w-44' onClick={() => navigate('/')} />
      {
        user?<UserButton/>
        :
        (
         <button onClick={openSignIn} className='flex item-center gap-3 rounded-full
          cursor-pointer text-sm  bg-primary text-black px-10 py-2.5'>
          Click Me<ArrowRight className='w-4 h-4 mt-1'/>
         </button>

        )

      }
      </div>
     

  )
}

export default Navbar