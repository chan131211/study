import ajax from './ajax'

export const loginRequest = (username, password) => ajax.post('/login', {username, password})