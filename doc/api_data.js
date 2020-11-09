define({ "api": [
  {
    "type": "post",
    "url": "/admin/attend/students",
    "title": "AddManyStudents",
    "name": "AddManyStudents",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "group": "AttendAdmin",
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作成功\",\n    \"affected\": 1,\n    \"errors\": [\n        {\n            \"username\": \"abc\",\n            \"password\": \"def\",\n            \"name\": \"abc\",\n            \"email\": \"email@qq.com\",\n            \"student_id\": \"asdf\",\n            \"teacher_username\": \"asdf\",\n            \"err\": \"不存在此老师\"\n        },\n        {\n            \"username\": \"abc\",\n            \"password\": \"def\",\n            \"name\": \"abc\",\n            \"email\": \"email@qq.com\",\n            \"student_id\": \"asdf\",\n            \"teacher_username\": \"asdf\",\n            \"err\": \"不存在此老师\"\n        },\n        {\n            \"username\": \"abc\",\n            \"password\": \"def\",\n            \"name\": \"abc\",\n            \"email\": \"email@qq.com\",\n            \"student_id\": \"asdf\",\n            \"teacher_username\": \"teacher\",\n            \"err\": {\n                \"response\": {\n                    \"msg\": \"该学生已存在\"\n                },\n                \"status\": 406,\n                \"message\": \"Http Exception\"\n            }\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "post",
    "url": "/admin/attend/lecture",
    "title": "AddOneLectue",
    "name": "AddOneLectue",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "post",
    "url": "/admin/attend/position",
    "title": "AddOnePosition",
    "name": "AddOnePosition",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作成功\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "post",
    "url": "/admin/attend/student",
    "title": "AddOneStudent",
    "name": "AddOneStudent",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{ \"msg\": \"操作成功\" }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "post",
    "url": "/admin/attend/lecture/:lid/student/:sid/:pid",
    "title": "AddRecordForStudent",
    "name": "AddRecordForStudent",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "put",
    "url": "/admin/attend/position/:pid",
    "title": "ChangeOnePosition",
    "name": "ChangeOnePosition",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作成功\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "put",
    "url": "/admin/attend/:uid/password",
    "title": "ChangePassword",
    "name": "ChangePassword",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "group": "AttendAdmin",
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "put",
    "url": "/admin/attend/student/:sid/password",
    "title": "ChangePasswordForStudent",
    "name": "ChangePasswordForStudent",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "group": "AttendAdmin",
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "put",
    "url": "/admin/attend/teacher/:tid/password",
    "title": "ChangePasswordForTeacher",
    "name": "ChangePasswordForTeacher",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "group": "AttendAdmin",
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "delete",
    "url": "/admin/attend/lecture/:lid",
    "title": "DeleteOneLectue",
    "name": "DeleteOneLectue",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "delete",
    "url": "/admin/attend/position",
    "title": "DeleteOnePosition",
    "name": "DeleteOnePosition",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "delete",
    "url": "/admin/attend/:rid",
    "title": "DeleteOneRecord",
    "name": "DeleteOneRecord",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "delete",
    "url": "/admin/attend/student/:sid",
    "title": "DeleteOneStudent",
    "name": "DeleteOneStudent",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "delete",
    "url": "/admin/attend/teacher/:tid",
    "title": "DeleteOneTeacher",
    "name": "DeleteOneTeacher",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "get",
    "url": "/admin/attend/students",
    "title": "GetAllAttendStudents",
    "name": "GetAllAttendStudents",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n \"id:\" 1,\n \"name\": \"jack\",\n \"student_id\": \"18342005\",\n \"email\": \"jack@qq.com\",\n \"user\": {\n   \"id\": 1,\n   \"username\": \"18342005\"\n }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "get",
    "url": "/admin/attend/lectures",
    "title": "GetAllLectures",
    "name": "GetAllLectures",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "parameter": {
      "fields": {
        "query string": [
          {
            "group": "query string",
            "type": "int",
            "optional": false,
            "field": "pageSize",
            "description": ""
          },
          {
            "group": "query string",
            "type": "int",
            "optional": false,
            "field": "offset",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "get",
    "url": "/admin/attend/positions",
    "title": "GetAllPositions",
    "name": "GetAllPositions",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n    {\n        \"id\": 1,\n        \"description\": \"testposition\",\n        \"device\": \"device1\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "get",
    "url": "/admin/attend/teachers",
    "title": "GetAllTeachers",
    "name": "GetAllTeachers",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "get",
    "url": "/admin/attend/teacher/:tid",
    "title": "GetOneTeacherInfo",
    "name": "GetOneTeacherInfo",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "get",
    "url": "/admin/attend/settings",
    "title": "GetSettings",
    "name": "GetSettings",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n {\n   \"key\": \"setting_key\",\n   \"value\": \"setting_val, may be string, array, or number\",\n   \"lastUpdateTime\": \"2020-09-01 11:15:00\",\n   \"lastUpdateAdmin\": {\n     \"name\": \"adminname\",\n     \"type\": \"admintype\"\n   }\n }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "get",
    "url": "/admin/attend/student/:sid",
    "title": "GetStudentInfo",
    "name": "GetStudentInfo",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"id\": 1,\n  \"name\": \"admin\",\n  \"email\": \"mail@qq.com\",\n  \"student_id\": \"18342005\",\n  \"teacher\": {\n    \"id\": 1,\n    \"name\": \"teachername\",\n    \"temail\": \"mail2@qq.com\",\n    \"personal_page\": \"www.baidu.com\",\n    \"research_area\": \"are, ee, test\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "get",
    "url": "/admin/attend/student/:sid/records",
    "title": "GetStudentRecords",
    "name": "GetStudentRecords",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "parameter": {
      "fields": {
        "query string": [
          {
            "group": "query string",
            "optional": false,
            "field": "pageSize",
            "description": ""
          },
          {
            "group": "query string",
            "optional": false,
            "field": "offset",
            "description": ""
          }
        ]
      }
    },
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
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "post",
    "url": "/admin/attend/teacher",
    "title": "InsertOneTeacher",
    "name": "InsertOneTeacher",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "put",
    "url": "/admin/attend/lecture/:lid",
    "title": "UpdateOneLecture",
    "name": "UpdateOneLecture",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "put",
    "url": "/admin/attend/student/:sid",
    "title": "UpdateOneStudentInfo",
    "name": "UpdateOneStudentInfo",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "put",
    "url": "/admin/attend/teacher/:tid",
    "title": "UpdateOneTeacher",
    "name": "UpdateOneTeacher",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "put",
    "url": "/admin/attend/setting",
    "title": "UpdateOrInsertSetting",
    "name": "UpdateOrInsertSetting",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "put",
    "url": "/admin/attend/student/:sid/teacher/:tid",
    "title": "UpdateTeacherForStudent",
    "name": "UpdateTeacherForStudent",
    "group": "AttendAdmin",
    "permission": [
      {
        "name": "Logined AttendAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n    \"msg\": \"操作已完成\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "AttendAdmin"
  },
  {
    "type": "post",
    "url": "/admin/bichoice/bistudent",
    "title": "AddNewBistudent",
    "name": "AddNewBistudent",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"操作成功\",\n  \"id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "post",
    "url": "/admin/bichoice/bistudents",
    "title": "AddNewBistudents",
    "name": "AddNewBistudents",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"操作成功\",\n  \"success\": 12,\n  \"error\": [\n    {}\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "post",
    "url": "/admin/bichoice/degree",
    "title": "AddNewDegree",
    "name": "AddNewDegree",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  \"degree_id\": 1,\n  \"degree_description\": \"\",\n  \"enrol_id\": 5,\n  \"enrol_description\": \"\"\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "post",
    "url": "/admin/bichoice/enrol",
    "title": "AddNewEnrol",
    "name": "AddNewEnrol",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"操作成功\",\n  \"id\": 3,\n  \"description\": \"enrol3\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "post",
    "url": "/admin/bichoice/source",
    "title": "AddNewSource",
    "name": "AddNewSource",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"添加成功\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "put",
    "url": "/admin/bichoice/bistudent/:id",
    "title": "ChangeBistudentInfo",
    "name": "ChangeBistudentInfo",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"修改成功\",\n  \"bistudent\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "put",
    "url": "/admin/bichoice/degree/:id",
    "title": "ChangeDegreeDescription",
    "name": "ChangeDegreeDescription",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  \"degree_id\": 1,\n  \"degree_description\": \"\",\n  \"enrol_id\": 5,\n  \"enrol_description\": \"\"\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "put",
    "url": "/admin/bichoice/enrol/:id",
    "title": "ChangeEnrolDescription",
    "name": "ChangeEnrolDescription",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"操作成功\",\n  \"id\": 3,\n  \"description\": \"enrol3\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "put",
    "url": "/admin/bichoice/source/:id",
    "title": "ChangeSourceDescription",
    "name": "ChangeSourceDescription",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"修改成功\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "delete",
    "url": "/admin/bichoice/degree/:id",
    "title": "DeleteDegree",
    "name": "DeleteDegree",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  \"degree_id\": 1,\n  \"degree_description\": \"\",\n  \"enrol_id\": 5,\n  \"enrol_description\": \"\"\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "delete",
    "url": "/admin/bichoice/file/:fid",
    "title": "DeleteFile",
    "name": "DeleteFile",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"删除成功\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "delete",
    "url": "/admin/bichoice/enrol/:id",
    "title": "DeleteOneEnrol",
    "name": "DeleteOneEnrol",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"操作成功\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "delete",
    "url": "/admin/bichoice/source/:id",
    "title": "DeleteOneSource",
    "name": "DeleteOneSource",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"删除成功\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "delete",
    "url": "/admin/bichoice/bistudent/:id/teacher/:tid",
    "title": "DeleteTeacherForStudent",
    "name": "DeleteTeacherForStudent",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"取消选择成功\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "get",
    "url": "/admin/bichoice/bistudents",
    "title": "GetAllBistudents",
    "name": "GetAllBistudents",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  {}\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "get",
    "url": "/admin/bichoice/bistudent/:id/teachers",
    "title": "GetBistudentCanSelectTeachers",
    "name": "GetBistudentCanSelectTeachers",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"修改成功\",\n  \"bistudent\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "get",
    "url": "/admin/bichoice/bistudent/:id/files",
    "title": "GetBistudentFileList",
    "name": "GetBistudentFileList",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  {\n    \"filename\": \"asd\",\n    \"fid\": 1\n  }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "get",
    "url": "/admin/bichoice/bistudent/:id/teachers/selected",
    "title": "GetBistudentSelectedTeachers",
    "name": "GetBistudentSelectedTeachers",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[1,2,3]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "get",
    "url": "/admin/bichoice/degrees",
    "title": "GetDegrees",
    "name": "GetDegrees",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  \"degree_id\": 1,\n  \"degree_description\": \"\",\n  \"enrol_id\": 5,\n  \"enrol_description\": \"\"\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "get",
    "url": "/admin/bichoice/enrols",
    "title": "GetEnrols",
    "name": "GetEnrols",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  {\n      \"id\": 1,\n      \"description\": \"enrol\"\n  },\n  {\n      \"id\": 2,\n      \"description\": \"enrol2\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "get",
    "url": "/admin/bichoice/file/:fid",
    "title": "GetFile",
    "name": "GetFile",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "get",
    "url": "/admin/bichoice/settings",
    "title": "GetSettings",
    "name": "GetSettings",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n {\n   \"key\": \"setting_key\",\n   \"value\": \"setting_val, may be string, array, or number\",\n   \"lastUpdateTime\": \"2020-09-01 11:15:00\",\n   \"lastUpdateAdmin\": {\n     \"name\": \"adminname\",\n     \"type\": \"admintype\"\n   }\n }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "get",
    "url": "/admin/bichoice/sources",
    "title": "GetSources",
    "name": "GetSources",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  {\"id\": 1, \"description\": \"a\"}\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "put",
    "url": "/admin/bichoice/bistudent/:id/teacher/:tid",
    "title": "SelectTeacherForStudent",
    "name": "SelectTeacherForStudent",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"选择成功\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "get",
    "url": "/admin/bichoice/setting",
    "title": "UpdateOrInsertSetting",
    "name": "UpdateOrInsertSetting",
    "group": "BiChoiceAdmin",
    "permission": [
      {
        "name": "Logined BiChoiceAdmin"
      }
    ],
    "version": "0.0.0",
    "filename": "src/admin/admin.controller.ts",
    "groupTitle": "BiChoiceAdmin"
  },
  {
    "type": "delete",
    "url": "/bistudent/file/:fid",
    "title": "DeleteFile",
    "name": "DeleteFile",
    "group": "Bistudent",
    "permission": [
      {
        "name": "Logined Bistudent"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  msg: '删除文件成功',\n  fid: 1\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/bistudent/bistudent.controller.ts",
    "groupTitle": "Bistudent"
  },
  {
    "type": "delete",
    "url": "/bistudent/teacher/:tid",
    "title": "DeleteOneTeacher",
    "name": "DeleteOneTeacher",
    "group": "Bistudent",
    "permission": [
      {
        "name": "Logined Bistudent"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  msg: '取消选择成功'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/bistudent/bistudent.controller.ts",
    "groupTitle": "Bistudent"
  },
  {
    "type": "get",
    "url": "/bistudent/teachers/all",
    "title": "GetAllTeachers",
    "name": "GetAllTeachers",
    "group": "Bistudent",
    "permission": [
      {
        "name": "Logined Bistudent"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  msg: '修改信息成功'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/bistudent/bistudent.controller.ts",
    "groupTitle": "Bistudent"
  },
  {
    "type": "put",
    "url": "/bistudent",
    "title": "GetBiChoiceInfo",
    "name": "GetBiChoiceInfo",
    "group": "Bistudent",
    "permission": [
      {
        "name": "Logined Bistudent"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"begin_time\": \"{\\\"value\\\":\\\"2020-11-6 23:16:00\\\"}\",\n  \"current_stage\": \"{\\\"value\\\":-1}\",\n  \"end_time\": \"{\\\"value\\\":\\\"2020-11-8 23:16:00\\\"}\",\n  \"stage_count\": \"{\\\"value\\\":3}\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/bistudent/bistudent.controller.ts",
    "groupTitle": "Bistudent"
  },
  {
    "type": "get",
    "url": "/bistudent/info",
    "title": "GetBistudentInfo",
    "name": "GetBistudentInfo",
    "group": "Bistudent",
    "permission": [
      {
        "name": "Logined Bistudent"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"id\": 1,\n  \"name\": \"biname\",\n  \"recommended\": 0,\n  \"score\": 396,\n  \"graduation_university\": \"university\",\n  \"graduation_major\": \"abc\",\n  \"household_register\": \"ddd\",\n  \"ethnic\": \"ethnic\",\n  \"phone\": \"newphone\",\n  \"gender\": \"x\",\n  \"email\": \"email@qq.com\",\n  \"source_des\": \"985\",\n  \"degree_des\": \"degree1\",\n  \"enrol_des\": \"enrol1\",\n  \"image\": 1,\n  \"selected_teachers\": \"[]\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/bistudent/bistudent.controller.ts",
    "groupTitle": "Bistudent"
  },
  {
    "type": "get",
    "url": "/bistudent/files",
    "title": "GetFileList",
    "name": "GetFileList",
    "group": "Bistudent",
    "permission": [
      {
        "name": "Logined Bistudent"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  {\n    \"filename\": \"abc\",\n    \"fid\": 1\n  }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/bistudent/bistudent.controller.ts",
    "groupTitle": "Bistudent"
  },
  {
    "type": "get",
    "url": "/bistudent/file/:fid",
    "title": "GetOneFile",
    "name": "GetOneFile",
    "group": "Bistudent",
    "permission": [
      {
        "name": "Logined Bistudent"
      }
    ],
    "version": "0.0.0",
    "filename": "src/bistudent/bistudent.controller.ts",
    "groupTitle": "Bistudent"
  },
  {
    "type": "post",
    "url": "/bistudent/file",
    "title": "PostNewFile",
    "name": "PostNewFile",
    "group": "Bistudent",
    "permission": [
      {
        "name": "Logined Bistudent"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  msg: '提交文件成功',\n  fid: 1\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/bistudent/bistudent.controller.ts",
    "groupTitle": "Bistudent"
  },
  {
    "type": "put",
    "url": "/bistudent/teacher/:tid",
    "title": "SelectOneTeacher",
    "name": "SelectOneTeacher",
    "group": "Bistudent",
    "permission": [
      {
        "name": "Logined Bistudent"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  msg: '选择成功'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/bistudent/bistudent.controller.ts",
    "groupTitle": "Bistudent"
  },
  {
    "type": "put",
    "url": "/bistudent/info",
    "title": "UpdateBistudentInfo",
    "name": "UpdateBistudentInfo",
    "group": "Bistudent",
    "permission": [
      {
        "name": "Logined Bistudent"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  msg: '修改信息成功'\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/bistudent/bistudent.controller.ts",
    "groupTitle": "Bistudent"
  },
  {
    "type": "post",
    "url": "/bistudent/image",
    "title": "UpdateImage",
    "name": "UpdateImage",
    "group": "Bistudent",
    "permission": [
      {
        "name": "Logined Bistudent"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  msg: '修改头像成功',\n  fid: 1\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/bistudent/bistudent.controller.ts",
    "groupTitle": "Bistudent"
  },
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
            "optional": false,
            "field": "pageSize",
            "description": ""
          },
          {
            "group": "query string",
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
    "type": "delete",
    "url": "/teacher/bistudent/:bisid",
    "title": "DeleteOneBistudent",
    "name": "DeleteOneBistudent",
    "group": "Teacher",
    "permission": [
      {
        "name": "Logined Teacher"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"取消选择成功\",\n  \"selected_students\": [[1],[2,3,4]]\n}",
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
    "url": "/teacher/bichoice",
    "title": "GetBiChoiceInfo",
    "name": "GetBiChoiceInfo",
    "group": "Teacher",
    "permission": [
      {
        "name": "Logined Teacher"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"begin_time\": \"{\\\"value\\\":\\\"2020-11-6 23:16:00\\\"}\",\n  \"current_stage\": \"{\\\"value\\\":1}\",\n  \"end_time\": \"{\\\"value\\\":\\\"2020-11-8 23:16:00\\\"}\",\n  \"stage_count\": \"{\\\"value\\\":3}\"\n}",
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
    "url": "/teacher/bistudents",
    "title": "GetBistudents",
    "name": "GetBistudents",
    "group": "Teacher",
    "permission": [
      {
        "name": "Logined Teacher"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n    [\n        {\n            \"id\": 1,\n            \"uid\": 11,\n            \"name\": \"bistudent\",\n            \"recommended\": 0,\n            \"score\": 399,\n            \"graduation_university\": \"uni\",\n            \"graduation_major\": \"maj\",\n            \"household_register\": \"reg\",\n            \"ethnic\": \"eth\",\n            \"phone\": \"phone\",\n            \"gender\": \"1\",\n            \"email\": \"mail\",\n            \"source\": 1,\n            \"degree\": 1,\n            \"image\": 11,\n            \"selected_teachers\": [\n                5\n            ]\n        }\n    ]\n]",
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
    "url": "/teacher/degrees",
    "title": "GetDegrees",
    "name": "GetDegrees",
    "group": "Teacher",
    "permission": [
      {
        "name": "Logined Teacher"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  {\n      \"id\": 1,\n      \"num\": 3,\n      \"degree_description\": \"degree\",\n      \"enrol_description\": \"enrol\",\n      \"count\": 1,\n      \"selected_students\": [\n          1\n      ]\n  }\n]",
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
    "url": "/teacher/enrols",
    "title": "GetEnrols",
    "name": "GetEnrols",
    "group": "Teacher",
    "permission": [
      {
        "name": "Logined Teacher"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  {\n      \"id\": 1,\n      \"num\": 3,\n      \"description\": \"enrol\",\n      \"count\": 1,\n      \"selected_students\": [\n          1\n      ]\n  }\n]",
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
    "url": "/teacher/bistudent/:bisid/files",
    "title": "GetOneBistudentFileList",
    "name": "GetOneBistudentFileList",
    "group": "Teacher",
    "permission": [
      {
        "name": "Logined Teacher"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[\n  {\n    \"filename\": \"abc\",\n    \"fid\": 1\n  }\n]",
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
    "url": "/teacher/bistudent/:bisid/file/:fid",
    "title": "GetOneBistudentOneFile",
    "name": "GetOneBistudentOneFile",
    "group": "Teacher",
    "permission": [
      {
        "name": "Logined Teacher"
      }
    ],
    "version": "0.0.0",
    "filename": "src/teacher/teacher.controller.ts",
    "groupTitle": "Teacher"
  },
  {
    "type": "get",
    "url": "/teacher/bistudents/selected",
    "title": "GetSelectedBistudents",
    "name": "GetSelectedBistudents",
    "group": "Teacher",
    "permission": [
      {
        "name": "Logined Teacher"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "[[1],[2,3,4,5]]",
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
    "url": "/teacher/student/:id",
    "title": "GetStudentRecords",
    "name": "GetStudentRecords",
    "group": "Teacher",
    "parameter": {
      "fields": {
        "query string": [
          {
            "group": "query string",
            "optional": false,
            "field": "pageSize",
            "description": ""
          },
          {
            "group": "query string",
            "optional": false,
            "field": "offset",
            "description": ""
          }
        ]
      }
    },
    "permission": [
      {
        "name": "Logined Teacher HasStudent"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n      \"total\": 2,\n      \"records\": [\n          {\n              \"id\": 1,\n              \"rtime\": \"2020-10-07T15:08:46.000Z\",\n              \"position\": \"testposition\",\n              \"detail\": {\n                  \"title\": \"lecture1\",\n                  \"content\": \"content1\",\n                  \"start\": \"2020-10-07T15:07:00.000Z\",\n                  \"end\": \"2020-10-09T15:07:00.000Z\"\n              }\n          },\n          {\n              \"id\": 2,\n              \"rtime\": \"1999-05-24T16:25:00.000Z\",\n              \"position\": \"testposition\",\n              \"detail\": {\n                  \"title\": \"日常考勤\"\n              }\n          }\n      ]\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/teacher/teacher.controller.ts",
    "groupTitle": "Teacher"
  },
  {
    "type": "put",
    "url": "/teacher/bistudent/:bisid",
    "title": "SelectOneBistudent",
    "name": "SelectOneBistudent",
    "group": "Teacher",
    "permission": [
      {
        "name": "Logined Teacher"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"msg\": \"选择成功\",\n  \"selected_students\": [[1],[2,3,4]]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/teacher/teacher.controller.ts",
    "groupTitle": "Teacher"
  },
  {
    "type": "put",
    "url": "/teacher/info",
    "title": "TeacherUpdateInformation",
    "name": "TeacherUpdateInformation",
    "group": "Teacher",
    "permission": [
      {
        "name": "Logined Teacher"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "{ \"msg\": \"操作成功\" }",
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
