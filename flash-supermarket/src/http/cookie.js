import cookie from 'js-cookie'


const username = "no_login"
const avatar_url = "avatar_url"
const isLogin = "false"
export const setIsLogin = (status) => {
    cookie.set(isLogin, status, {expires: 1})
}
export const getIsLogin = () => {
    return cookie.get(isLogin) === "true"
}

export const setUsername = (name) => {
    cookie.set(username, name, {expires: 1})
}
export const getUsername = () => {
    return cookie.get(username)
}

export const setAvatarUrl = (url) => {
    cookie.set(avatar_url, url, {expires: 1})
}
export const getAvatarUrl = () => {
    return cookie.get(avatar_url)
}


export const removeCookie = () => {
    cookie.remove(isLogin)
    cookie.remove(username)
    cookie.remove(avatar_url)
}