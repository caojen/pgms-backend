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

+ 数据库迁移
  + 从django/sqlite3迁移到mysql

+ 环境准备
```
npm install
```
+ 数据库migrate
```
// 不加-e参数默认到dev
npm run migrate create name
npm run migrate up -c 5
// 测试环境下:
npm run migrate create name -e test
```
