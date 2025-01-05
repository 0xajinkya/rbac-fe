import axios from "axios";

const http = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default http;