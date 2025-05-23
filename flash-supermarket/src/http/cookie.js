import cookie from 'js-cookie'

const test_id = "test_id"



export const setTestId = (id) => {
    Cookies.set(test_id, id, {expires: 1})
}
export const getTestId = () => {
    return Cookies.get(test_id)
}
export const removeTestId = () => {
    Cookies.remove(test_id)
}
