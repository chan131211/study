import ajax from './ajax.js'

export const loginRequest = (username, password) => ajax.post('/login', { username, password })

export const reqAddCategory =  (name, parentId) => ajax.post('/manage/category/add', { name, parentId })

export const reqGetCategorys = (parentId) => ajax.get('/manage/category/list?parentId=' + parentId)

export const reqUpdateCategory = (_id, name) => ajax.post('/manage/category/update', { _id, name })

export const reqAllCategorys = () => ajax.get('/manage/category/all')

export const reqdelCategory = (_id) => ajax.get('/manage/category/del?_id=' + _id)

export const reqdelImage = (name) => ajax.post('/manage/img/del', { name })

export const reqAddProduct = (product) => ajax.post('/manage/product/add', { product })

export const reqGetProducts = () => ajax.get('/manage/product/list')

export const reqCheckProduct = (name) => ajax.post('/manage/product/check', { name })

export const reqUpdateProductStatus = (_id, status) => ajax.post('/manage/product/status', { _id, status })

export const reqDelProduct = (_id) => ajax.get('/manage/product/del?_id=' + _id)
