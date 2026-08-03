import axios from "axios";

export const axiosInstanace=axios.create({
    baseURL:"http://localhost:5000/api",
    withCredentials:true,
})