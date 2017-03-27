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
        component: require('../pages/example/example')
    }]
}]
