import axios from 'axios';

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    withCredentials: true,
    // headers: {
    //     Authorization: "Bearer" + localStorage.getItem("token")
    // }
});
// api.interceptors.request.use((config) => {
//     const token = JSON.parse(localStorage.getItem("token")) || null;
//     // console.log("TOKEN SENT:", token);
//     // const token = '1234567ytrewsdfdweqq'
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//         // console.log("HEADER:", config.headers.Authorization);
//     }

//     return config;
// });
export default api;