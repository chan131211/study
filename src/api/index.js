import ajax from './ajax.js'

export const loginRequest = (username, password) => ajax.post('/login', { username, password })

export const reqAddCategory =  (name, parentId) => ajax.post('/manage/category/add', { name, parentId })

export const reqGetCategorys = (parentId) => ajax.get('/manage/category/list?parentId='+ parentId)

export const reqUpdateCategory = (_id, name) => ajax.post('/manage/category/update', { _id, name })