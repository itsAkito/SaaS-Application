import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const AiTools = () => {
    const navigate = useNavigate()
    const { user } = useUser()
    return (
        <div className='px-4 sm:px-20 xl:px-32 mt-15'>
            <div className='text-center'>
                <h2 className='text-white text-[42px] font-semibold'>Powerful AI Tools</h2>
                <p className=' text-white max-w-lg mx-auto'>Everything you need to create,enhance and optimize your content with cutting-edge AI technology.

                </p>
            </div>
            <div className='flex flex-wrap justify-center mt-8'>
                {AiToolsData.map((tool, index) => (
                    <div key={index} className='p-9 m-4 rounded-lg max-w-xl bg-[#FDFDFE]
    shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer'
                        onClick={() => user && navigate(tool.path)}>
                        <tool.Icon className=' w-12 h-12 p-3 text-black rounded-xl'
                            style={{ background: `linear-gradient(to bottom ,${tool.bg.from},${tool.bg.to})` }} />
                        <h3 className='mt-6 mb-3 text-lg font-sb text-black'>{tool.title}</h3>
                        <p className='text-black text-sm max-w-[95%]'>{tool.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AiTools