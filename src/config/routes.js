// 将组件抽离成不同的代码块，当路由访问到的时候再去加载，实现路由懒加载
const example = r => require(['../pages/example/example'], r)


export default [{
    path: '/',
    name: 'login',
    component: require('../pages/login')
},{
    path: '/admin',
    name: 'admin',
    component: require('../pages'),
    children: [ {
        name: 'example',
        path: 'example',
        component: example
    }]
}]
