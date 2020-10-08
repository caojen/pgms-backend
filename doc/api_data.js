define({ "api": [
  {
    "type": "get",
    "url": "/student/records",
    "title": "GetStudentAllRecords",
    "name": "GetStudentAllRecords",
    "parameter": {
      "fields": {
        "query string": [
          {
            "group": "query string",
            "type": "int",
            "optional": false,
            "field": "pageSize",
            "description": ""
          }
        ],
        "query String": [
          {
            "group": "query String",
            "type": "int",
            "optional": false,
            "field": "offset",
            "description": ""
          }
        ]
      }
    },
    "group": "Student",
    "permission": [
      {
        "name": "Logined Student"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n   \"total\": 1,\n   \"records\": [\n   {\n        \"id\": 1,\n        \"rtime\": \"2020-10-07T15:08:46.000Z\",\n        \"position\": \"testposition\",\n        \"detail\": {\n            \"title\": \"lecture1\",\n            \"content\": \"content1\",\n            \"start\": \"2020-10-07T15:07:00.000Z\",\n            \"end\": \"2020-10-09T15:07:00.000Z\"\n        }\n    }\n]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/student/student.controller.ts",
    "groupTitle": "Student"
  },
  {
    "type": "put",
    "url": "/student/email",
    "title": "StudentChangeEmail",
    "name": "StudentChangeEmail",
    "group": "Student",
    "permission": [
      {
        "name": "Logined User"
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
    "filename": "src/student/student.controller.ts",
    "groupTitle": "Student"
  },
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
    "url": "/teacher/students",
    "title": "GetAllStudents",
    "name": "GetAllStudents",
    "permission": [
      {
        "name": "Logined Teacher"
      }
    ],
    "group": "Teacher",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n     {\n         \"id\": 1,\n         \"name\": \"admin\",\n         \"email\": \"efbffcbc@mail2.sysu.edu.cn\",\n         \"latestRecordTime\": \"2020-10-07T15:08:46.000Z\"\n     }\n ]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/teacher/teacher.controller.ts",
    "groupTitle": "Teacher"
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
