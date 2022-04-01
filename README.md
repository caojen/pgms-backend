# 中山大学研究生管理系统：双选+考勤

> 考勤系统已经名存实亡，建议仅考虑双选功能。

通过本README，你应该可以将后端搭建起来。在此之前提醒一句，务必随机应变，过程出错很有可能与环境或依赖版本有关，请善用github issue、google、stack overflow。实在解决不了的话，联系github@caojen，或你的上一个负责人员。

## 概述

后端主要有几个模块：
1. 任何系统都离开不了的数据库，我们使用的是Mysql。
2. 一个存放了学生上传文件的文件系统，我们使用的是[SeaweedFs](https://github.com/chrislusf/seaweedfs)
3. 后端api（也就是本项目）

我们按照步骤来搭建相关功能。

## MYSQL 搭建

MYSQL Server怎么建起来请自行谷歌，如果害怕污染本地环境的话建议用docker做容器：
```bash
docker run --name my-mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:8.0
```

> 本地测试可以随便搞个简单的密码，生产环境的密码找相关负责人员拿。

然后，将`migrations`文件夹里面的四个sql文件应用上，按照顺序：
```
mysql -uroot -p -h 127.0.0.1 -P 3306 < ./migrations/init.sql
mysql -uroot -p -h 127.0.0.1 -P 3306 -D pgms < ./migrations/addfilename.sql
mysql -uroot -p -h 127.0.0.1 -P 3306 -D pgms < ./migrations/feedback.sql
mysql -uroot -p -h 127.0.0.1 -P 3306 -D pgms < ./migrations/feedback-add-createtime.sql
```

> 自行处理上面的ip和端口。

## 文件系统搭建

docker解万愁

```bash
cd seaweedfs
cp seaweed-compose.yml docker-compose.yml
docker-compose up -d
rm docker-compose.yml
cd -
```

如果启动不成功，请自行检查端口是否被占用，并决定修改端口或终止已有程序。

如果你没有改动docker-compose文件，那么应该会监听到9333端口。下面我们都用9333端口。

## api搭建

如果没有其他问题的话，你就可以直接启动这个仓库了。在启动之前，有一些环境变量需要你去配置：

```
MYSQL_HOST: 数据库ip
MYSQL_PORT: 数据库端口
MYSQL_USER: 数据库用户名
MYSQL_PASSWORD: 数据库密码
MYSQL_DATABASE: 数据库名，使用pgms

FILE_SYSTEM: seaweedfs查询ip，如果你不知道的话，用: http://127.0.0.1
FILE_SYSTEM_LOOKUP: seaweedfs查询端口和路径，如果你不知道的话用: :9333/dir/assign

```

例如：
```bash
export MYSQL_HOST=127.0.0.1
export MYSQL_PORT=3306
export MYSQL_USER=root
export MYSQL_PASSWORD=123456
export MYSQL_DATABASE=pgms

export FILE_SYSTEM=http://127.0.0.1
export FILE_SYSTEM_LOOKUP=:9333/dir/assign
```

```bash
npm install
npm run start:dev  # 测试模式
npm run start:prod # 生产模式
```

或者用docker：
```bash
docker build . -t pgms-backend:latest
docker run -it --name pgms-backend --network=host --rm pgms-backend:latest
```

启动后将会server将会监听5100端口。试试吧：
```
curl http://127.0.0.1:5100
```