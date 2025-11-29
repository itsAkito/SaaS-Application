import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import BlogTitles from './pages/BlogTitles';
import WriteArticle from './pages/WriteArticle';
import Community from './pages/Community';
import RemoveBackground from './pages/RemoveBackground';
import RemoveObject from './pages/RemoveObject'
import GenerateImages from './pages/GenerateImages';
import ReviewResume from './pages/ReviewResume';
import Home from './pages/Home';
import { useAuth } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';

const App=()=> {

  const{getToken}=useAuth();
  const[token,setToken]=useState([]);

useEffect(() => {
  getToken().then((token) => {
    setToken(token);
    console.log(token);
});
}, [])

// const {getToken}=useAuth()
//   useEffect(()=>{
//     getToken().then((token)=>console.log(token));
  
//   },[])

  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    

    </div>
  )
}

export default App
