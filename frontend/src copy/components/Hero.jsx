import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { assets } from '../assets/assets'
import { use } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate=useNavigate()
  return (
    <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col
     w-full justify-center bg-[url(/gradientBackground.png)] 
     bg-cover bg-no-repeat h-screen '>
        <div className='text-center mb-6'>
        <h1 className='text-3xl sm:text-6xl md:text-4xl
         2xl:text-7xl font-sb mx-auto leading-[1.2]'>Made amazing content<br/> with
            <span className='text-blue-400'> AI tools </span></h1>
            <p className='mt-5 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-500'>
                Transform you content creation with our suite of Superb AI tools. Write articles, geneate images, and enhance your workflow.
            </p>
         </div>
         <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
         <button onClick={()=>navigate('/ai')}className='cursor-pointer'> Start creating now</button>
         <button className='cursor-pointer'>Watch now</button>
    </div>
    <div className='flex items-center gap-4 mt-8 mx-auto text-gray-700'>
        <img src={assets.user_group} alt="" className='h-10'/></div>
    </div>
    
  )
}

export default Hero