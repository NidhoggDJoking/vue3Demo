#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
# set -e

# 生成静态文件
yarn run build

# 进入生成的文件夹
cd ./dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME


git init
git add -A
git commit -m 'deploy to the gh-pages'

# 如果发布到 https://<USERNAME>.github.io
git push -f git@gitee.com:NidhoggDJoking/vue3-demo.git master:gh-pages


# 本地操作场景专用

cd -

rm -rf dist

# 解决gitee 没有工作流/流水线 无法自动部署， 请在gitee 仓库下使用