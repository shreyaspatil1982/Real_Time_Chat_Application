
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import SettingPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";

function App() {
    const{authUser,checkAuth,isCheckingAuth,onlineUsers} =useAuthStore();
    
   console.log(authUser);
  
    useEffect(()=>{
         checkAuth()
    },[ checkAuth]);

    if(isCheckingAuth && !authUser) return(
      
    <div className="flex items-center justify-center h-screen">
         <Loader className="size-10 animate-spin"/>
    </div>

    )
      
    

  return (
    <BrowserRouter>
    <div>
      <Navbar/>
      <Routes>
        <Route  path="/" element={authUser?<HomePage/>: <Navigate to={"/login"}/>}/>
        <Route  path="/login" element={!authUser?<LoginPage/>:<Navigate to={"/"}/>}/>
        <Route  path="/signup" element={!authUser?<SignUpPage/>:<Navigate to={"/"}/>}/>
        <Route  path="/settings" element={<SettingPage/>}/>
        <Route  path="/Profile" element={authUser?<ProfilePage/>:<Navigate to={"/login"}/>}/>
      </Routes>

      
      <Toaster/>
    </div>
    
    </BrowserRouter>
  )
}

export default App
