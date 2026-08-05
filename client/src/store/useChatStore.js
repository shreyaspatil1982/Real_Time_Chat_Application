import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstanace } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstanace.get("/messages/getUsers");
      set({ users: res.data });
      
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstanace.get(`/messages/${userId}/get`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstanace.post(`/messages/${selectedUser._id}/send`, messageData);
      
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subScribeToMessages:()=>{
    const { selectedUser } = get();
     if (!selectedUser) return;
      const socket= useAuthStore.getState().socket;

      if (!socket) return;

      socket.on("newMessage",(newMessage)=>{
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

         set({messages:[...get().messages,newMesage]});
      })
  },

  unSubscribeFromMessages:()=>{
         const socket=useAuthStore.getState().socket;
         socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
})
);