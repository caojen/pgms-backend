define({ "api": [
  {
    "type": "get",
    "url": "/student/teacher",
    "title": "StudentGetTeacher",
    "name": "StudentGetTeacher",
    "group": "Student",
    "permission": [
      {
        "name": "Logined Student"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "success-reponse",
          "content": "{\n    \"name\": \"teacher\",\n    \"email\": \"abc@mail.qq.com\",\n    \"personal_page\": \"abc\",\n    \"research_area\": \"edf\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/student/student.controller.ts",
    "groupTitle": "Student"
  },
  {
    "type": "get",
    "url": "/user/status",
    "title": "CurrentUserStatus",
    "name": "GetUserStatus",
    "group": "User",
    "permission": [
      {
        "name": "Logined"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"uid\": 1,\n  \"username\": \"18542100\",\n  \"student\": {\n    \"id\": 5\n    \"name\": \"jack\",\n    \"sid\": \"18542100\",\n    \"email\": \"ab@qq.com\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/user/user.controller.ts",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/user/password",
    "title": "ChangePassword",
    "name": "UserChangePassword",
    "group": "User",
    "permission": [
      {
        "name": "Logined"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n   \"msg\": \"修改密码成功\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/user/user.controller.ts",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/login",
    "title": "UserLogin",
    "name": "UserLogin",
    "group": "User",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"uid\": 1,\n  \"username\": \"18542100\",\n  \"student\": {\n    \"id\": 5\n    \"name\": \"jack\",\n    \"sid\": \"18542100\",\n    \"email\": \"ab@qq.com\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "LoginFailed",
            "description": "<p>Username not exists, or password error</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "HasLogined",
            "description": "<p>There's a logined user, need to logout first</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/user/user.controller.ts",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/user/logout",
    "title": "UserLogout",
    "name": "UserLogout",
    "group": "User",
    "permission": [
      {
        "name": "Logined"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n   \"msg\": \"操作成功\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/user/user.controller.ts",
    "groupTitle": "User"
  }
] });
