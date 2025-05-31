import httpInstance from './globalConfig';

export async function loginApi(data) {
    const res = await httpInstance.request({
        url: '/login',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (res.status === 200) {
        return res.data;
    } else {
        throw new Error('Login failed, res status is not 200', res.status);
    }

}

export async function registerApi(data) {
    const res = await httpInstance.request({
        url: '/register',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (res.status === 200) {
        return res.data;
    } else {
        throw new Error('Register failed, res status is not 200', res.status);
    }
}
