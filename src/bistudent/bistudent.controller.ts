import { Body, Controller, Delete, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { LoginRequired } from 'src/user/user.guard';
import { BistudentPermission } from './bistudent.guard';
import { BistudentService } from './bistudent.service';

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

  @Put('teacher/:tid')
  @UseGuards(LoginRequired, BistudentPermission)
  async selectOneTeacher(@Req() request, @Param() param: {tid: string}) {
    const bid = request.user.bistudent.id;
    const tid = parseInt(param.tid);

    return await this.bistudentService.selectOneTeacher(bid, tid);
  }

  @Delete('teacher/:tid')
  @UseGuards(LoginRequired, BistudentPermission)
  async deleteOneTeacher(@Req() request, @Param() param: {tid: string}) {
    const bid = request.user.bistudent.id;
    const tid = parseInt(param.tid);

    return await this.bistudentService.deleteOneTeacher(bid, tid);
  }

}
