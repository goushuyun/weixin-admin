// 将组件抽离成不同的代码块，当路由访问到的时候再去加载，实现路由懒加载
const example = r => require(['../pages/example/example'], r)
const shops = r => require(['../pages/shops/shops'], r)
const shop_info = r => require(['../pages/manage/index'], r)
const cloud_shop = r => require(['../pages/manage/shop_info'], r)
const shop_setting = r => require(['../pages/shop_setting/index'], r)
const school = r => require(['../pages/shop_setting/school'], r)

export default [{
    path: '/',
    name: 'login',
    component: require('../pages/login')
}, {
    path: '/shops',
    name: 'shops',
    component: shops
}, {
    path: '/admin',
    name: 'admin',
    component: require('../pages'),
    children: [{
        name: 'example',
        path: 'example',
        component: example
    }, {
        path: 'shop_info',
        name: 'shop_info',
        component: shop_info,
        children: [{
            name: 'cloud_shop',
            path: 'cloud_shop',
            component: cloud_shop
        }]
    }, {
        name: 'shop_setting',
        path: 'shop_setting',
        component: shop_setting,
        children: [{
            path: 'school',
            name: "school",
            component: school
        }]
    }]
}]
