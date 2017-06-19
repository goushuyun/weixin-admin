// 将组件抽离成不同的代码块，当路由访问到的时候再去加载，实现路由懒加载
const shops = r => require(['../pages/shops/shops.vue'], r)

// 系统概况/首页
const home = r => require(['../pages/home.vue'], r)

// * 订单管理
// ** 订单列表
const order_list = r => require(['../pages/order_manage/order_list.vue'], r)
// ** 订单详情
const order_detail = r => require(['../pages/order_manage/order_detail.vue'], r)

// * 线下零售
// ** 零售页面
const retail = r => require(['../pages/offline_retail/retail.vue'], r)
// ** 零售订单列表
const retail_list = r => require(['../pages/offline_retail/retail_list.vue'], r)

// * 推荐管理
// *** 话题推荐
const topic = r => require(['../pages/recommend/topic/index.vue'], r)
// *** 新增话题
const add_topic = r => require(['../pages/recommend/topic/add_topic.vue'], r)
// *** 轮播图
const carousel = r => require(['../pages/recommend/carousel/index.vue'], r)

// * 库存管理
// ** 库存查看
const stock_list = r => require(['../pages/stock_manage/stock_list.vue'], r)

// * 图书上架
// ** ISBN 上传
const by_isbn = r => require(['../pages/add_book/by_isbn.vue'], r)
// ** Excel 上传
const by_excel = r => require(['../pages/add_book/excel_upload.vue'], r)

// * 统计
// ** 销售额统计
const salses = r => require(['../pages/statistics/sales.vue'], r)

// * 资产
// ** 线上资产
const online_account = r => require(['../pages/account/online_account.vue'], r)

// * 设置
// ** 店铺信息
const store_info = r => require(['../pages/store_info/index.vue'], r)
// *** 云店信息
const cloud_store = r => require(['../pages/store_info/cloud_store.vue'], r)
// *** 实体店信息
const real_store = r => require(['../pages/store_info/real_store.vue'], r)
// 微信设置
const weixin_setting = r => require(['../pages/store_info/weixin.vue'], r)
// ** 店铺设置
const store_setting = r => require(['../pages/store_setting/index.vue'], r)
// *** 人员管理
const people = r => require(['../pages/store_setting/people.vue'], r)
// *** 经营学校
const school = r => require(['../pages/store_setting/school/school.vue'], r)
// *** 仓库设置
const location = r => require(['../pages/store_setting/location/depot.vue'], r)
// **** 货架管理
const shelf = r => require(['../pages/store_setting/location/shelf.vue'], r)
// *** 配送费设置
const freight = r => require(['../pages/store_setting/freight.vue'], r)
// *** 客服、售后设置
const service = r => require(['../pages/store_setting/service.vue'], r)

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
        }, {
            name: 'real_store',
            path: 'real_store',
            component: real_store
        }]
    }, {
        path: 'home',
        name: 'home',
        component: home
    }, {
        path: 'order/detail',
        name: 'order_detail',
        component: order_detail
    }, {
        path: 'order/list',
        name: 'order_list',
        component: order_list
    }, {
        path: 'offline/retail',
        name: 'offline_retail',
        component: retail
    }, {
        path: 'offline/retail_list',
        name: 'retail_list',
        component: retail_list
    }, {
        name: 'store_setting',
        path: 'store_setting',
        component: store_setting,
        children: [{
            path: 'people',
            name: "people",
            component: people
        }, {
            path: 'school',
            name: "school",
            component: school
        }, {
            path: 'location',
            name: "location",
            component: location
        }, {
            path: 'shelf',
            name: "shelf",
            component: shelf
        }, {
            path: 'freight',
            name: "freight",
            component: freight
        }, {
            path: 'service',
            name: "service",
            component: service
        }]
    }, {
        name: 'topic',
        path: 'recommend/topic',
        component: topic
    },  {
        name: 'add_topic',
        path: 'recommend/add_topic',
        component: add_topic
    }, {
        name: 'carousel',
        path: 'recommend/carousel',
        component: carousel
    }, {
        name: 'stock_list',
        path: 'stock_manage/stock_list',
        component: stock_list
    }, {
        name: 'by_isbn',
        path: 'add_book/by_isbn',
        component: by_isbn
    }, {
        name: 'sales',
        path: 'statistics/sales',
        component: salses
    }, {
        name: 'by_excel',
        path: 'add_book/by_excel',
        component: by_excel
    }, {
        name: 'online_account',
        path: 'account/online',
        component: online_account
    }, {
        name: 'weixin_setting',
        path: 'weixin_setting',
        component: weixin_setting
    }]
}]
