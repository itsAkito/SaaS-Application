import { Sparkles, Scissors } from 'lucide-react'
import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
const RemoveObject = () => {
  const [input, setInput] = useState('')
  const [object, setObject] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      if (object.trim().split(' ').length > 1 ) {
        setLoading(false)
        return toast('please enter only one object name')
      }
      const formData = new FormData()
      formData.append('image', input,input.name)
      formData.append('object', object)

      const token = await getToken()
      const { data } = await axios.post('api/ai/remove-image-object', formData,
        { headers: { Authorization: `Bearer ${token}` } })
        console.log( "BACKEND RESPONSE :" ,data)
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      // console.error(error.message);
    }
    setLoading(false);
  }
  return (
    <div className="h-full p-6 flex flex-col lg:flex-row gap-6 text-slate-600">
      {/* Left Panel: Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 max-w-2xl p-6 bg-gray-100 rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 text-[#8092c5]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>

        <label className="block mt-4 text-sm font-medium">Upload Image</label>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept='image/*' required
          className="w-full mt-2 p-2 px-3 text-sm rounded-md border border-gray-300 text-gray-600 outline-none"
        />
        <label className="block mt-4 text-sm font-medium">Describe Object name to remove</label>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          placeholder="e.g., watch or spoon ,Only single"
          required
          className="w-full mt-2 p-2 px-3 text-sm rounded-md border border-gray-300 outline-none"
        />
        <button type="submit" disabled={loading} className="w-full flex justify-center
           items-center gap-3 bg-gradient-to-r from-[#417DF6]
           to-[#8e37e8] text-white px-4 py-2 mt-7 text-sm rounded-lg">
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> :
            <Scissors className="w-5" />
          }
          Remove Object</button>
      </form>

      {/* Right Panel: Output */}
      <div className="w-full lg:w-1/2 max-w-2xl p-6 bg-white rounded-lg border border-gray-300 overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          < Scissors className="w-5 h-5 text-[#0f1f4b]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>

        </div>
        {
          !content ? (

            <div className="flex-1 flex items-center justify-center">
              <div className="text-sm flex flex-col items-center gap-6 text-gray-500">
                <Scissors className="w-9 h-9" />
                <p>Enter a image and click "Remove Object" to get started</p>
              </div>
            </div>
          ) : (
            <img src={content} alt='image' className='w-full h-full mt-3' />
          )
        }
      </div>
    </div>

  )
}

export default RemoveObject