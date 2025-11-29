// import React from 'react'
// import { Hash, Sparkles } from 'lucide-react';
// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import { useAuth } from '@clerk/clerk-react';
// import axios from 'axios'
// import Markdown from 'react-markdown';
// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

// const BlogTitles = () => {
//   const blogCategories = ["General", "Travel"
//     , "Food", "Lifestyle", "Education", "Technology", "Interviews", "Case Studies"]

//   const [input, setInput] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState("General");
//   const [loading, setLoading] = useState(false)
//   const [content, setContent] = useState('')
//   const { getToken } = useAuth()

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     try {
    
//       setLoading(true)
//       const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;
//       const { data } = await axios.post('api/ai/generate-blog-title', { prompt },
//          { headers: { Authorization: `Bearer ${ await getToken()}` } })
//       if (data.success) {
//         setContent(data.content)
//       } else {
//         toast.error(data.message)
//       }
//     }
//     catch (error) {
//       toast.error(error.message)
//     }
//     setLoading(false)
//     // Add your article generation logic here
//   };
//   return (

//     <div className="h-full p-6 flex flex-col lg:flex-row gap-6 text-slate-600">
//       {/* Left Panel: Form */}
//       <form
//         onSubmit={onSubmitHandler}
//         className="w-full lg:w-1/2 max-w-2xl p-6 bg-gray-100 rounded-lg border border-gray-200"
//       >
//         <div className="flex items-center gap-3 mb-4">
//           <Sparkles className="w-6 text-[#8092c5]" />
//           <h1 className="text-xl font-semibold">AI Generated Blog Titles</h1>
//         </div>

//         <p className="block mt-4 text-sm font-medium">Keyword</p>
//         <input
//           onChange={(e) => setInput(e.target.value)}
//           value={input}
//           type="text"
//           placeholder="Build the future with artificial intelligence..."
//           required
//           className="w-full mt-2 p-2 px-3 text-sm rounded-md border border-gray-300 outline-none"
//         />

//         <p className="block mt-6 text-sm font-medium">Category</p>
//         <div className="mt-3 flex gap-3 flex-wrap">
//           {blogCategories.map((item) => (
//             <span
//               key={item}
//               onClick={() => setSelectedCategory(item)}
//               className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item
//                   ? 'bg-purple-100 text-purple-600 border-blue-300'
//                   : 'text-gray-500 border-gray-200'}`}>
//               {item}
//             </span>
//           ))}
//         </div>
//         <br/>

//         <button
//           type="submit" disabled={loading}
//           className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#c341f6] to-[#8092c5]  text-black px-4 py-2 mt-6 text-sm rounded-lg coursor-pointer '>
//           {loading ?<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
//           :<Hash className="w-5" />}
//           Generate title
//         </button>
//       </form>

//       {/* Right Panel: Output */}
//       <div className="w-full lg:w-1/2 max-w-2xl p-6 bg-white rounded-lg border border-gray-300 overflow-y-auto">
//         <div className="flex items-center gap-3 mb-4">
//           <Hash className="w-5 h-5 text-[#5e79c1]" />
//           <h1 className="text-xl font-semibold">Generated titles</h1>
//         </div>
//         {
//           !content ?(
        
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-sm flex flex-col items-center gap-6 text-gray-500">
//             <Hash className="w-9 h-9" />
//             <p>Enter a topic and click "Generate Article" to get started</p>
//           </div>
//         </div>
//         ) : (
//           <div className='reset-tw'>
//             <Markdown>{content}</Markdown>
//           </div>
//         )
//         }
//       </div>
//     </div>

//   )
// }

// export default BlogTitles;


import React from 'react'
import { Hash, Sparkles } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'
import Markdown from 'react-markdown';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const BlogTitles = () => {
  const blogCategories = ["General", "Travel"
    , "Food", "Lifestyle", "Education", "Technology", "Interviews", "Case Studies"]

  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const token = await getToken();
    const prompt = `Generate a compelling blog title using the keyword "${input}" in the category "${selectedCategory}". Make it engaging and relevant for readers.`;

    const { data } = await axios.post(
      'api/ai/generate-blog-title',
      { prompt, length:500 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.success) {
      setContent(data.content);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
    console.error("Blog generation error:", error);
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
          <Sparkles className="w-6 text-[#8092c5]" />
          <h1 className="text-xl font-semibold">AI Generated Blog Titles</h1>
        </div>

        <p className="block mt-4 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Build the future with artificial intelligence..."
          required
          className="w-full mt-2 p-2 px-3 text-sm rounded-md border border-gray-300 outline-none"
        />

        <p className="block mt-6 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item
                  ? 'bg-purple-100 text-purple-600 border-blue-300'
                  : 'text-gray-500 border-gray-200'}`}>
              {item}
            </span>
          ))}
        </div>
        <br/>

        <button
          type="submit" disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-gradiant-to-or from-[#c341f6] to-[#8092c5]  text-black px-4 py-2 mt-6 text-sm rounded-lg coursor-pointer '>
          {loading ?<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          :<Hash className="w-5" />}
          Generate title
        </button>
      </form>

      {/* Right Panel: Output */}
      <div className="w-full lg:w-1/2 max-w-2xl p-6 bg-white rounded-lg border border-gray-300 overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <Hash className="w-5 h-5 text-[#5e79c1]" />
          <h1 className="text-xl font-semibold">Generated titles</h1>
        </div>
        {
          !content ?(
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm flex flex-col items-center gap-6 text-gray-500">
            <Hash className="w-9 h-9" />
            <p>Enter a topic and click "Generate Article" to get started</p>
          </div>
        </div>
        ) : (
          <div className='reset-tw'>
            <Markdown>{content}</Markdown>
          </div>
        )
        }
      </div>
    </div>

  )
}

export default BlogTitles;