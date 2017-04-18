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

rsync -e ssh -r ./build/* --progress -cv 'root@115.28.109.6:/home/weixin-admin'
# rsync -e ssh -r ./static/* --progress -cv 'root@115.28.109.6:/home/weixin-admin/static'
