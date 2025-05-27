import cookie from 'js-cookie'

const test_id = "test_id"

const username = "username"
const avatar_url = "avatar_url"

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




export const setTestId = (id) => {
    Cookies.set(test_id, id, {expires: 1})
}
export const getTestId = () => {
    return Cookies.get(test_id)
}
export const removeTestId = () => {
    Cookies.remove(test_id)
}
