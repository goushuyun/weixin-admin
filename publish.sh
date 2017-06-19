func=$1

buildfile() {
    # 删除旧的dist文件
    if [ -d "./dist" ]; then
        rm -rf ./dist
    fi

    # 编译代码
    npm run build

    # 创建要存放待上传的代码的文件
    if [ -d "./build" ]; then
        rm -rf ./build
    fi
    mkdir -p build/dist

    # 向 build 文件夹中copy文件

    # copy images 文件夹、入口 html
    cp -r ./src/images  ./index.html ./build
    # copy 打包后的js
    cp ./dist/* ./build/dist

    rm -rf ./dist
}

upload_test() {
    echo '即将发布到【测试】环境...'

    # 写入配置文件
    echo "export default {
        redirect_uri: 'https://admin.goushuyun.cn/static/weixin_redirect.html',
        component_appid: 'wxb39264d954771192',
        url_encode_domain: 'https%3a%2f%2fapp.goushuyun.cn',
        base_url: 'https://admin.goushuyun.cn/',
        home_href: 'https://admin.goushuyun.cn/#'
    }" > ./src/config/conf.js

    buildfile
    rsync -e ssh -r ./build/* --progress -cv 'root@115.28.109.6:/home/web/admin/'
    rsync -e ssh -r ./static/* --progress -cv 'root@115.28.109.6:/home/web/admin/static/'
    date
}

upload_production() {
    echo '即将发布到【生产】环境...'

    echo "export default {
        redirect_uri: 'http://weixin.goushuyun.com/static/weixin_redirect.html',
        component_appid: 'wx1c2695469ae47724',
        url_encode_domain: 'https%3a%2f%2fapp.goushuyun.com',
        base_url: 'http://admin.goushuyun.com/',
        home_href: 'http://admin.goushuyun.com/#'
    }" > ./src/config/conf.js

    buildfile
    rsync -e ssh -r ./build/* --progress -cv 'root@139.129.227.229:/home/web/admin'
    rsync -e ssh -r ./static/* --progress -cv 'root@139.129.227.229:/home/web/admin/static/'
    date
}

$func

exit 0
