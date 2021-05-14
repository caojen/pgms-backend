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

+ 如何更新代码：
  1. 推送到本仓库
  2. 在``/home/pgms/PGMS/backend``中执行``git pull``，由于当前处于开发模式，会自动启动最新的代码

+ mysql.config:
  + 位于``database.json``
  + 注意：json里面的``multipleStatements``只用于迁移，项目中不允许多条sql执行

## Issue

+ 迁移数据库
  1. 将User表迁移
  2. 迁移两种身份，也就是Student, Teacher
  3. 不用迁移文件数据、老师双选配置
  4. 迁移考勤记录，包括
     1. 所有的位置信息，录入设备号和对应的地点名
     2. 迁移讲座
     3. 迁移考勤记录
