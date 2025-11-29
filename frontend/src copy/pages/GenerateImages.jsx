import React, { useState } from 'react'
import { Image, Sparkles } from 'lucide-react';
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
axios .defaults.baseURL=import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = ["Fantasy", "Realistic", "Anime style", "Cartoon style", "Ghibli style", "Natural style", "3D style", "Portrait style"]

  const [input, setInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState("Realstic");
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `Generate image  of ${input} in the style ${selectedStyle}`
      const { data } = await axios.post('api/ai/generate-image', { prompt, publish }, { headers: { Authorization: `Bearer ${await getToken()}` } })

      if (data.success) {
        setContent(data.image_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
    setLoading(false);
  };


  return (
    <div className="h-full p-6 flex flex-col lg:flex-row gap-6 text-slate-600">
      {/* Left Panel: Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 max-w-2xl p-6 bg-gray-100 rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 text-[#6043c5]" />
          <h1 className="text-xl font-semibold">AI Image Generator </h1>
        </div>

        <label className="block mt-4 text-sm font-medium">Deescribe Your Image</label>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          placeholder="Describe what you want to see"
          required
          className="w-full mt-2 p-2 px-3 text-sm rounded-md border border-gray-300 outline-none"
        />

        <label className="block mt-6 text-sm font-medium">Style</label>
        <div className="mt-3 flex gap-3 flex-wrap">
          {imageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item
                  ? 'bg-green-50 text-green-600 '
                  : 'text-gray-500 border-gray-300'
                }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className='my-6 flex items-center gap-3'>
          <label className='relative cursor-pointer '>
            <input type='checkbox' onChange={(e) => setPublish(e.target.checked)}
              checked={publish} className='sr-only peer' />

            <div className='w-9 h-6 bg-slate-300 rounded-full peer-checked:bg-green-500 transition '></div>
            <span className='absolute left-1 top-1.5 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p>
            Make this image Public</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-[#22ff9f] to-[#65ADFF] text-white px-4 py-2 mt-7 text-sm rounded-lg"
        >{loading ? <span className='w-4 h-4 rounded-full border-2 border-t-transparent animate-spin'></span>
          : <Image className="w-5" />}
          Generate Image
        </button>
      </form>

      {/* Right Panel: Output */}
      <div className="w-full lg:w-1/2 max-w-2xl p-6 bg-white rounded-lg border border-gray-300 overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <Image className="w-5 h-5 text-[#5e79c1]" />
          <h1 className="text-xl font-semibold">Generated images</h1>
        </div>
        {
          !content ? (

            <div className="flex-1 flex items-center justify-center">
              <div className="text-sm flex flex-col items-center gap-6 text-gray-500">
                <Image className="w-9 h-9" />
                <p>Enter a topic and click "Generate Image" to get started</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full'>
              <img src={content} alt="image" className='w-full h-full object-contain' />
            </div>
          )}
      </div>
    </div>

  )
}

export default GenerateImages