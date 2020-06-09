import ajax from './ajax.js'

export const loginRequest = (username, password) => ajax.post('/login', {username, password})