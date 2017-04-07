// 将组件抽离成不同的代码块，当路由访问到的时候再去加载，实现路由懒加载
const example = r => require(['../pages/example/example'], r)
const shops = r => require(['../pages/shops/shops'], r)
const store_info = r => require(['../pages/store_info/index'], r)
const cloud_store = r => require(['../pages/store_info/cloud_store'], r)
const real_store = r => require(['../pages/store_info/real_store'], r)
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
        path: 'store_info',
        name: 'store_info',
        component: store_info,
        children: [{
            name: 'cloud_store',
            path: 'cloud_store',
            component: cloud_store
        },{
            name: 'real_store',
            path: 'real_store',
            component: real_store
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
