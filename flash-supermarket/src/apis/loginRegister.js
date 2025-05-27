import axios from 'axios';

const httpInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  Headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});


export async function loginApi(data) {
    return httpInstance.request({
        url: '/login',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function registerApi(data) {
    return httpInstance.request({
        url: '/register',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
