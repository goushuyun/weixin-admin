// 将组件抽离成不同的代码块，当路由访问到的时候再去加载，实现路由懒加载
const shops = r => require(['../pages/shops/shops'], r)

// * 设置
// ** 店铺信息
const store_info = r => require(['../pages/store_info/index'], r)
// *** 云店信息
const cloud_store = r => require(['../pages/store_info/cloud_store'], r)
// *** 实体店信息
const real_store = r => require(['../pages/store_info/real_store'], r)

// ** 店铺设置
const store_setting = r => require(['../pages/store_setting/index'], r)
// *** 人员管理
const people = r => require(['../pages/store_setting/people'], r)
// *** 经营学校
const school = r => require(['../pages/store_setting/school'], r)
// *** 仓库设置
const location = r => require(['../pages/store_setting/location'], r)
// *** 配送费设置
const freight = r => require(['../pages/store_setting/freight'], r)
// *** 客服、售后设置
const service = r => require(['../pages/store_setting/service'], r)

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
        name: 'store_setting',
        path: 'store_setting',
        component: store_setting,
        children: [{
            path: 'people',
            name: "people",
            component: people
        },{
            path: 'school',
            name: "school",
            component: school
        },{
            path: 'location',
            name: "location",
            component: location
        },{
            path: 'freight',
            name: "freight",
            component: freight
        },{
            path: 'service',
            name: "service",
            component: service
        }]
    }]
}]
