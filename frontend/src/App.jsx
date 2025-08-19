import React, { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import CallPage from './pages/CallPage'
import { Navigate, Route , Routes} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotificationPage from './pages/NotificationPage'
import ChatPage from './pages/ChatPage'
import OnboardingPage from "./pages/OnboardingPage"
import {Toaster} from "react-hot-toast"

import PageLoader from './componenets/PageLoader'
import useAuthUser from './hooks/useAuthUser'
import Layout from "./componenets/Layout"
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {

//   const [data,setdata]=useState([]);
//     const [isloading,setisloading]=useState(false);
//     const [error,seterror]=useState(null);

//     useEffect(()=>{
// const getdata = async ()=>{
//   setisloading(true);
//   try{
//   const data = await fetch("https://jsonplaceholder.typicode.com/todos");
//   const json = await data.json();
//   setdata(json)
//   } catch(error){
//     seterror(error)
//   } finally{
//     setisloading(false)
//   }

//     } 
     
//     getdata();
//   },[])

// rather than of doing this there is a better method known as TANSTACK QUERY
  const { theme } = useThemeStore();
 const {isloading , authUser} = useAuthUser()

 const isAuthenticated= Boolean(authUser)
 const isOnboarded = authUser?.isOnboard
   if (isloading){
  return <PageLoader/>
}

  return (
    
  
    <div className='h-screen'  data-theme={theme}>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded?
         <Layout showSidebar= {true}>
          <HomePage /> 
          </Layout>
          : 
             (<Navigate to = {!isAuthenticated ?"/login" : "/onboard" } />)} />

        <Route path="/signup" element={ !isAuthenticated ?<SignupPage/> :  <Navigate to = {!isOnboarded ?"/onboard ":"/" }/>}/>

        <Route path="/login" element={!isAuthenticated ?<LoginPage/> : <Navigate to = {!isOnboarded ?"/onboard ":"/" }/>}/>

        <Route path="/notifications" element={isAuthenticated && isOnboarded?
        (<Layout showSidebar= {true}><NotificationPage/></Layout> ): 
        (<Navigate to = {!isAuthenticated ?"/login" : "/onboard" } />)}/>


          <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />
            )
          }
        />
       
        
        <Route path="/chat/:id" element={ isAuthenticated && isOnboarded?
       ( <Layout showSidebar= {true}><ChatPage/></Layout>) : 
        (<Navigate to = {!isAuthenticated ?"/login" : "/onboard" } />)}/>


        <Route path='/onboard' element={ isAuthenticated ? (!isOnboarded ? (<OnboardingPage/>):(<Navigate to = "/" />)) : (<Navigate to = "/login" /> )}/>


      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
