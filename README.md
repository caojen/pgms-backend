# 研究生管理系统-后端

+ 功能包括
  + 研究生考勤
  + 研究生双选

+ 后端框架
  + NestJs
```
    nestjs --version
    >> 7.5.1
```

+ 项目启动：
  + ``npm install``
  + ``npm run start:dev``(开发模式)
  + ``npm run start:prod``(生产模式)

+ 数据库迁移
  + 从django/sqlite3迁移到mysql

+ 环境准备
  + 端口占用：5001
  + 位于：``/home/pgms/PGMS/backend``
  + 已被supervisor监听：``supervisorctl status``
  + supervisor配置文件：``/etc/supervisord.conf``
  + 目前出于开发模式

+ 如何更新代码：
  1. 推送到本仓库
  2. 在``/home/pgms/PGMS/backend``中执行``git pull``，由于当前处于开发模式，会自动启动最新的代码

+ mysql.config:
  + 位于``database.json``
  + 注意：json里面的``multipleStatements``只用于迁移，项目中不允许多条sql执行
