
import { Edit, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown'
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL

const WriteArticle = () => {
  const articleLength = [
    { length: 900, text: 'Short (600–900 words)' },
    { length: 1300, text: 'Medium (900–1300 words)' },
    { length: 1800, text: 'Long (1500+ words)' },
  ];

  const [input, setInput] = useState('');
  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [loading,setLoading]=useState(false)
  const[content,setContent]=useState('')

  const {getToken}= useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Add your article generation logic here
    try{
      setLoading(true)
      const prompt=`write an article about ${input} in ${selectedLength.text}`
      const {data}=await axios.post('/api/ai/generate-article',
        {prompt,length:selectedLength.length},
        {
          headers:{Authorization:`Bearer ${await getToken()}`}
        }
      )
      if(data.success){
        setContent(data.content)
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
    setLoading(false)
  }


  return (

    <div className="h-full p-6 flex flex-col lg:flex-row gap-6 text-slate-600">
      {/* Left Panel: Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 max-w-2xl p-6 bg-gray-100 rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>

        <label className="block mt-4 text-sm font-medium">Article Topic</label>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Build the future with artificial intelligence..."
          required
          className="w-full mt-2 p-2 px-3 text-sm rounded-md border border-gray-300 outline-none"
        />

        <label className="block mt-6 text-sm font-medium">Article Length</label>
        <div className="mt-3 flex gap-3 flex-wrap">
          {articleLength.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? 'bg-blue-100 text-blue-500 border-blue-300'
                  : 'text-gray-500 border-gray-200'
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-[#226BFF] to-[#65ADFF]
           text-white px-4 py-2 mt-7 text-sm rounded-lg"
        >{loading ?<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          :<Edit className="w-5" />
        }
          Generate Article
        </button>
      </form>

      {/* Right Panel: Output */}
      <div className="w-full lg:w-1/2 max-w-2xl p-6 bg-white rounded-lg border border-gray-300 min-h-[450px] max-h-[700px] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Article</h1>
        </div>
        {!content ?(
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm flex flex-col items-center gap-6 text-gray-500">
            <Edit className="w-9 h-9" />
            <p>Enter a topic and click "Generate Article" to get started</p>
          </div>
        </div>
        ):(
        <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
          <div className='reset-tw'>
        <Markdown>{content}</Markdown>
          <div>{content}</div>
          </div>
          </div>
        )}
      </div>
      </div>
  );
};

export default WriteArticle;
