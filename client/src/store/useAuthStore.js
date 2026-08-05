import { create } from "zustand";
import { axiosInstanace } from "../lib/axios";
import SignUP from "../pages/SignUpPage";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL="http://localhost:5000";
export const useAuthStore = create((set,get) => ({
   authUser: null,
   isSigningUp: false,
   isLogingUp: false,
   isProfileUpdating: false,
   isCheckingAuth: true,
   onlineUsers:[],
   socket:null,

   checkAuth: async () => {
      try {
         const res = await axiosInstanace.get("/auth/check");
         set({ authUser: res.data });
         get().userConnected();
      } catch (error) {
         console.log(" error in auth store checkauth", error);
         set({ authUser: null });
      }
      finally {
         set({ isCheckingAuth: false });
      }
   },

   signup: async (data) => {
      set({ isSigningUp: true });
      try {

         const res = await axiosInstanace.post("/auth/signup", data);
         set({ authUser: res.data });
         get().userConnected();
         toast.success("Account created successfully");
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         set({ isSigningUp: false });
      }
   },

   logout: async () => {

      try {
         await axiosInstanace.post("/auth/logout");
         set({ authUser: null });
         get().userDisconnected();
         toast.success("Logged out successfully");
      } catch (error) {
         toast.error(error.response.data.message);
      }

   },

   login: async (data) => {
      set({ isLogingUp: true })
      try {
         const res = await axiosInstanace.post("/auth/login", data);
         set({ authUser: res.data });
         get().userConnected();
      } catch (error) {
         console.log(error.message);
      } finally {
         set({ isLogingUp: false });
      }
   },

   updateProfile: async (data) => {
      set({ isProfileUpdating: true });
      try {
         const res = await axiosInstanace.put("/auth/updateProfile", data);
         set({ authUser: res.data });
         toast.success("Profile updated successfully");
      } catch (error) {
         console.log("error in update profile:", error);
         toast.error(error.response.data.message);
      } finally {
         set({ isProfileUpdating: false });
      }
   },

   userConnected:()=>{
      const { authUser } = get();
       if (!authUser || get().socket?.connected) return;
      const socket=io(
         import.meta.env.DEV ? "http://localhost:5000" : undefined,{
         query:{
            userId:authUser._id,
         },
      });

      socket.connect();

      socket.on("getOnlineUsers",(userIds)=>{
          set({onlineUsers:userIds});
      })

      set({socket:socket});

       
   },

   userDisconnected:()=>{

      if(get().socket?.connected) get().socket?.disconnect();
        
   }

})); 