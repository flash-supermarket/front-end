import axios from "axios";

const httpInstance = axios.create({
    baseURL: "http://8.210.10.16:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 20000,
    });

export default httpInstance;