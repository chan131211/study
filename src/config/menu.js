export const menuList = [
    {
        title: '首页',
        key: '/admin/home',
        icon: 'home'
    },
    {
        title: '商品',
        key: '/products',
        icon: 'mail',
        childMenu: [
            {
                title: '商品管理',
                key: '/admin/product',
                icon: 'shop'
            },
            {
                title: '分类管理',
                key: '/admin/category',
                icon: 'linkedin'
            }
        ]
    },
    {
        title: '角色管理',
        key: '/admin/role',
        icon: 'user'
    }
]