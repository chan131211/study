import ajax from './ajax.js'

//登录请求
export const loginRequest = (username, password) => ajax.post('/login', { username, password })

//添加商品分类请求
export const reqAddCategory =  (name, parentId) => ajax.post('/manage/category/add', { name, parentId })

//获取商品分类请求
export const reqGetCategorys = (parentId) => ajax.get('/manage/category/list?parentId=' + parentId)

//更新商品分类请求
export const reqUpdateCategory = (_id, name) => ajax.post('/manage/category/update', { _id, name })

//获取所有商品分类请求
export const reqAllCategorys = () => ajax.get('/manage/category/all')

//删除商品分类请求
export const reqdelCategory = (_id) => ajax.get('/manage/category/del?_id=' + _id)

//删除商品图片请求
export const reqdelImage = (name) => ajax.post('/manage/img/del', { name })

//添加/更新商品请求
export const reqAddOrUpdateProduct = (product, _id) => ajax.post(`/manage/product/${ _id ? 'update' : 'add' }`, { product, _id })

//获取商品请求
export const reqGetProducts = (pageNum, pageSize) => ajax.get('/manage/product/list', { params: { pageNum, pageSize }})

//查找同名商品请求
export const reqCheckProduct = (name) => ajax.post('/manage/product/check', { name })

//更新商品状态请求
export const reqUpdateProductStatus = (_id, status) => ajax.post('/manage/product/status', { _id, status })

//删除商品请求
export const reqDelProduct = (_id, images) => ajax.post('/manage/product/del?_id=', { _id, images })

//根据_id获取商品
export const reqGetProduct = (_id) => ajax.get('/manage/product/listone?_id=' + _id)

//搜索框查询请求
export const reqSearchProduct = (search, value) => ajax.post('/manage/product/search', { search, value })

//添加角色
export const reqAddRole = (name) => ajax.post('/manage/role/add', { name })

//获取所有角色
export const reqGetRoles = () => ajax.get('/manage/role/list')

//更新角色权限 
export const reqUpdateRole = (role) => ajax.post('/manage/role/update', { role })

//根据_id查找角色权限
export const reqCheckRole =_id => ajax.get('/manage/role/check?_id=' + _id)
  
//添加用户
export const reqAddUser = (user) => ajax.post('/manage/user/add', { user })

//获取所有用户
export const reqGetUsers = () => ajax.post('/manage/user/list')

//更新用户
export const reqUpdateUser = (user) => ajax.post('/manage/user/update', { user })

//查找同名用户
export const reqCheckUser = (username) => ajax.post('/manage/user/check', { username }) 

//删除用户
export const reqDeleteUser = _id => ajax.get('/manage/user/delete?_id=' + _id)



