import store from 'store'

const USER_KEY = 'user_key'
export default {
    //将用户登陆信息写入localStorage
    saveLoginData(user) {
        // localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY, user)
    },

    //获取用户登陆信息
    getLoginData() {
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },

    //删除用户登陆信息
    removeLoginData() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}