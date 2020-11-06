import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { LoginRequired } from 'src/user/user.guard';
import { BistudentPermission } from './bistudent.guard';
import { BistudentService } from './bistudent.service';
import * as mime from 'mime-types';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('bistudent')
export class BistudentController {

  constructor(
    private readonly bistudentService: BistudentService
  ) {}

  /**
   * @api {put} /bistudent GetBiChoiceInfo
   * @apiName GetBiChoiceInfo
   * @apiGroup Bistudent
   * @apiPermission Logined Bistudent
   * @apiSuccessExample {json} Success-Response
    {
      "begin_time": "{\"value\":\"2020-11-6 23:16:00\"}",
      "current_stage": "{\"value\":-1}",
      "end_time": "{\"value\":\"2020-11-8 23:16:00\"}",
      "stage_count": "{\"value\":3}"
    }
   */
  @Get('')
  @UseGuards(LoginRequired, BistudentPermission)
  async getBiChoiceInfo() {
    return this.bistudentService.getBiChoiceInfo();
  }

  /**
   * @api {get} /bistudent/info GetBistudentInfo
   * @apiName GetBistudentInfo
   * @apiGroup Bistudent
   * @apiPermission Logined Bistudent
   * @apiSuccessExample {json} Success-Response
    {
      "id": 1,
      "name": "biname",
      "recommended": 0,
      "score": 396,
      "graduation_university": "university",
      "graduation_major": "abc",
      "household_register": "ddd",
      "ethnic": "ethnic",
      "phone": "newphone",
      "gender": "x",
      "email": "email@qq.com",
      "source_des": "985",
      "degree_des": "degree1",
      "enrol_des": "enrol1",
      "image": 1,
      "selected_teachers": "[]"
    }
   */
  @Get('info')
  @UseGuards(LoginRequired, BistudentPermission)
  async getInfo(@Req() request) {
    return request.user.bistudent;
  }

  /**
   * @api {put} /bistudent/info UpdateBistudentInfo
   * @apiName UpdateBistudentInfo
   * @apiGroup Bistudent
   * @apiPermission Logined Bistudent
   * @apiSuccessExample {json} Success-Response
    {
      msg: '修改信息成功'
    }
   */
  @Put('info')
  @UseGuards(LoginRequired, BistudentPermission)
  async updateInfo(@Req() request, @Body() body: {
    phone: string,
    email: string,
  }) {
    return await this.bistudentService.updateInfo(request.user.bistudent.id, body);
  }

  /**
   * @api {get} /bistudent/teachers/all GetAllTeachers
   * @apiName GetAllTeachers
   * @apiGroup Bistudent
   * @apiPermission Logined Bistudent
   * @apiSuccessExample {json} Success-Response
    {
      msg: '修改信息成功'
    }
   */
  @Get('teachers/all')
  @UseGuards(LoginRequired, BistudentPermission)
  async getAllTeachers(@Req() request) {
    const bid = request.user.bistudent.id;
    return await this.bistudentService.getAllTeachers(bid);
  }

  /**
   * @api {put} /bistudent/teacher/:tid SelectOneTeacher
   * @apiName SelectOneTeacher
   * @apiGroup Bistudent
   * @apiPermission Logined Bistudent
   * @apiSuccessExample {json} Success-Response
    {
      msg: '选择成功'
    }
   */
  @Put('teacher/:tid')
  @UseGuards(LoginRequired, BistudentPermission)
  async selectOneTeacher(@Req() request, @Param() param: {tid: string}) {
    const bid = request.user.bistudent.id;
    const tid = parseInt(param.tid);

    return await this.bistudentService.selectOneTeacher(bid, tid);
  }

  /**
   * @api {delete} /bistudent/teacher/:tid DeleteOneTeacher
   * @apiName DeleteOneTeacher
   * @apiGroup Bistudent
   * @apiPermission Logined Bistudent
   * @apiSuccessExample {json} Success-Response
    {
      msg: '取消选择成功'
    }
   */
  @Delete('teacher/:tid')
  @UseGuards(LoginRequired, BistudentPermission)
  async deleteOneTeacher(@Req() request, @Param() param: {tid: string}) {
    const bid = request.user.bistudent.id;
    const tid = parseInt(param.tid);

    return await this.bistudentService.deleteOneTeacher(bid, tid);
  }

  /**
   * @api {get} /bistudent/file/:fid GetOneFile
   * @apiName GetOneFile
   * @apiGroup Bistudent
   * @apiPermission Logined Bistudent
   */
  @Get('file/:fid')
  @UseGuards(LoginRequired, BistudentPermission)
  async getFile(@Req() request, @Param() param: {fid: string}, @Res() response) {
    // 学生通过此接口获得文件信息(包括头像和个人信息文件)
    const id = request.user.bistudent.id;
    const imageId = request.user.bistudent.image;
    const fid = parseInt(param.fid);
    const content = await this.bistudentService.getFile(id, imageId, fid);
    response.end(Buffer.from(content));
  }

  /**
   * @api {post} /bistudent/file PostNewFile
   * @apiName PostNewFile
   * @apiGroup Bistudent
   * @apiPermission Logined Bistudent
   * @apiSuccessExample {json} Success-Response
    {
      msg: '提交文件成功',
      fid: 1
    }
   */
  @Post('file/')
  @UseGuards(LoginRequired, BistudentPermission)
  @UseInterceptors(FileInterceptor('file', {
    limits: {fileSize: 50 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
      const mimetype = file.mimetype;
      const allowtype = [
        mime.lookup('jpg'),
        mime.lookup('png'),
        mime.lookup('pdf'),
      ];

      if(allowtype.indexOf(mimetype) !== -1) {
        cb(null, true);
      } else {
        cb(new HttpException({
          msg: '不接受此文件类型'
        }, 406), false);
      }
    }
  }))
  async postFile(@Req() request, @UploadedFile() file: {originalname: string, buffer: Buffer}) {
    const id = request.user.bistudent.id;
    return await this.bistudentService.postFile(id, file);
  }

  /**
   * @api {post} /bistudent/image UpdateImage
   * @apiName UpdateImage
   * @apiGroup Bistudent
   * @apiPermission Logined Bistudent
   * @apiSuccessExample {json} Success-Response
    {
      msg: '修改头像成功',
      fid: 1
    }
   */
  @Post('image')
  @UseGuards(LoginRequired, BistudentPermission)
  @UseInterceptors(FileInterceptor('file', {
    limits: {fileSize: 10*1024*1024},
    fileFilter: (req, file, cb) => {
      const mimetype = file.mimetype;
      const allowtype = [
        mime.lookup('jpg'),
        mime.lookup('png')
      ];

      if(allowtype.indexOf(mimetype) !== -1) {
        cb(null, true);
      } else {
        cb(new HttpException({
          msg: '不接受此文件类型',
          status: false
        }, 403), false);
      }
      
    }
  }))
  async postImage(@Req() request, @UploadedFile() image: {originalname: string, buffer: Buffer}) {
    const id = request.user.bistudent.id;
    return await this.bistudentService.postImage(id, image);
  }

  /**
   * @api {delete} /bistudent/file/:fid DeleteFile
   * @apiName DeleteFile
   * @apiGroup Bistudent
   * @apiPermission Logined Bistudent
   * @apiSuccessExample {json} Success-Response
    {
      msg: '删除文件成功',
      fid: 1
    }
   */
  @Delete('file/:fid')
  @UseGuards(LoginRequired, BistudentPermission)
  async deleteFile(@Req() request, @Param() param: {fid: string}) {
    const id = request.user.bistudent.id;
    const fid = parseInt(param.fid);
    return await this.bistudentService.deleteFile(id, fid);
  }


  /**
   * @api {get} /bistudent/files GetFileList
   * @apiName GetFileList
   * @apiGroup Bistudent
   * @apiPermission Logined Bistudent
   * @apiSuccessExample {json} Success-Response
    [
      {
        "filename": "abc",
        "fid": 1
      }
    ]
   */
  @Get('files')
  @UseGuards(LoginRequired, BistudentPermission)
  async getFileList(@Req() request) {
    const id = request.user.bistudent.id;
    return await this.bistudentService.getFileList(id);
  }
}
