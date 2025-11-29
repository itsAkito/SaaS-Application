import { Sparkles, FileText } from 'lucide-react';
import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const ReviewResume = () => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth()
  const onSubmitHandler = async (e) => {

    e.preventDefault();
    if (!input)
      return alert("Please upload a resume file");

    setLoading(true)
    const token = await getToken();
    const formData = new FormData();
    formData.append('resume', input);

    console.log(token)
    // console.log('submitting resume for review:', input);
    if (!token) {
      setLoading(false);
      return toast.error("Authentication failed. Please log in again.");
    }

    try {
      const res = await axios.post('/api/ai/review-resume', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = res.data;
      if (data.success) {
        // console.log("Resume review result:", data.analysis);
        setContent(data.content);
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      alert(error.message || "An error occurres while reviewing resume");
      toast.error(error.message)
    }
    setLoading(false)
  };
  return (
    <div className="h-full p-6 flex flex-col lg:flex-row gap-6 text-slate-600">
      {/* Left Panel: Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 max-w-2xl p-6 bg-gray-100 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 text-[#8092c5]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>

        <label className="block mt-4 text-sm font-medium">Upload Resume</label>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept='application/pdf*' required
          className="w-full mt-2 p-2 px-3 text-sm rounded-md border border-gray-300 text-gray-600 outline-none"
        />
        <p className='text-gray-500 text-xs font-center mt-2 gap-2'>Supports PDF resume only </p>

        <button
          disabled={loading}
          type="submit" className="w-full flex justify-center
           items-center gap-3 bg-gradient-to-r from-[#F6AB41]
           to-[#FF4938] text-white px-4 py-2 mt-7 text-sm rounded-lg">
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> :
            <FileText className="w-5" />
          }
          Review Resume
        </button>
      </form>

      {/* Right Panel: Output */}
      <div className="w-full lg:w-1/2 max-w-2xl p-6 bg-white rounded-lg border border-gray-300 overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          < FileText className="w-5 h-5 text-[#0f1f4b]" />
          <h1 className="text-xl font-semibold">Analysis Result</h1>
        </div>
        {
          !content ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-sm flex flex-col items-center gap-6 text-gray-500">
                <FileText className="w-9 h-9" />
                <p>Enter a Resume and click "Review Resume" to get started</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
              <div className='reset-tw'>
                <Markdown>{content}</Markdown>
              </div>
            </div>)}
      </div>
    </div>
  )
}

export default ReviewResume