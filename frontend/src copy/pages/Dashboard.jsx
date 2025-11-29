import React, { useEffect, useState } from 'react'
// import { dummyCreationData } from '../assets/assets'
import { Sparkle, Gem, Sparkles } from 'lucide-react'
import { Protect, useAuth } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import axios from 'axios'
import toast from 'react-hot-toast'
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
const Dashboard = () => {
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()
  const getDashboard = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success(data.message)
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }
  useEffect(() => {
    getDashboard()
  }, [])

  return (
    <div className='h-full flex flex-col overflow-y-scroll p-6'>
      <div className='flex items-center justify-between  w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
        <div className='text-slate-500'>
          <p className='text-sm'>Total Creations</p>
          <h2 className='text-xl font-semibold'>
            {creations.length}
          </h2>
        </div>
        <div className=' w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588f2] to-[#0bb0d7] text-black flex justify-center items-center'>
          <Sparkles className='w-6 text-black' />
        </div>
      </div>
      <div className='flex items-center justify-between mt-4 w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
        <div className='text-slate-500'>
          <p className='text-sm'>Active Plan</p>
          <h2 className='text-xl font-semibold'>
            <Protect plan='premium' fallback='Free' >
              Premium </Protect>
          </h2>
        </div>
        <div className=' w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff61c5] to-[#9e53ee] text-black flex justify-center items-center'>
          <Gem className='w-6 text-black' />
        </div>
      </div>
      {
        loading ? (
          <div className='flex justify-center items-center h-3/4'>
            <div className=' animate-spin rounded-full h-12 w-12 border-3 border-purple-500 border-t transparent'>
            </div>
          </div>
        ) : (


          <div className='space-y-3'>
            <p className='mt-6 mb-5'>Recent Creations</p>
            {
              creations.map((item) => <CreationItem key={item.id} item={item} />)
            }
          </div>
        )}
    </div>

  )
}

export default Dashboard