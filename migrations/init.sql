-- MySQL Script generated by MySQL Workbench
-- Fri Nov  6 22:07:36 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema pgms
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pgms
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pgms` DEFAULT CHARACTER SET latin1 ;
USE `pgms` ;

-- -----------------------------------------------------
-- Table `pgms`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '用户全局唯一Id',
  `username` VARCHAR(64) NOT NULL COMMENT '用户名',
  `password` VARCHAR(1024) NOT NULL COMMENT '用户密码, 由于需要从Django/sqlite3中迁移数据库,因此需要符合原来的加密算法',
  `isActive` TINYINT(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`admin` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `uid` INT(11) NULL DEFAULT NULL,
  `type` ENUM('admin', 'attend', 'bichoice') NOT NULL,
  `name` VARCHAR(16) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `admin_uid_ref_user_id_idx` (`uid` ASC) ,
  CONSTRAINT `admin_uid_ref_user_id`
    FOREIGN KEY (`uid`)
    REFERENCES `pgms`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`enrol`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`enrol` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `description_UNIQUE` (`description` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`degree`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`degree` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `enrol` INT(11) NOT NULL,
  `description` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `degree_enrol_ref_enrol_id_idx` (`enrol` ASC) ,
  CONSTRAINT `degree_enrol_ref_enrol_id`
    FOREIGN KEY (`enrol`)
    REFERENCES `pgms`.`enrol` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`file`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`file` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `port` VARCHAR(8) NOT NULL,
  `ffid` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `fid_UNIQUE` (`ffid` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`source`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`source` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`bistudent`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`bistudent` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `uid` INT(11) NOT NULL,
  `name` VARCHAR(16) NOT NULL,
  `recommended` TINYINT(4) NOT NULL DEFAULT '0',
  `score` INT(11) NOT NULL DEFAULT '100',
  `graduation_university` VARCHAR(45) NOT NULL DEFAULT '',
  `graduation_major` VARCHAR(45) NOT NULL DEFAULT '',
  `household_register` VARCHAR(45) NOT NULL DEFAULT '',
  `ethnic` VARCHAR(8) NOT NULL DEFAULT '',
  `phone` VARCHAR(32) NOT NULL DEFAULT '',
  `gender` VARCHAR(8) NOT NULL DEFAULT '',
  `email` VARCHAR(256) NOT NULL DEFAULT '',
  `source` INT(11) NOT NULL,
  `degree` INT(11) NOT NULL,
  `image` INT(11) NOT NULL COMMENT '头像所在文件',
  `selected_teachers` VARCHAR(256) NOT NULL DEFAULT '[]' COMMENT '一个含有teacher_id的数组, 按序代表学生选择的志愿顺序',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uid_UNIQUE` (`uid` ASC) ,
  INDEX `bistudent_source_ref_source_id_idx` (`source` ASC) ,
  INDEX `bistudent_degree_ref_degree_id_idx` (`degree` ASC) ,
  INDEX `bistudent_image_ref_file_id_idx` (`image` ASC) ,
  CONSTRAINT `bistudent_degree_ref_degree_id`
    FOREIGN KEY (`degree`)
    REFERENCES `pgms`.`degree` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `bistudent_image_ref_file_id`
    FOREIGN KEY (`image`)
    REFERENCES `pgms`.`file` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `bistudent_source_ref_source_id`
    FOREIGN KEY (`source`)
    REFERENCES `pgms`.`source` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `bistudent_uid_ref_user_id`
    FOREIGN KEY (`uid`)
    REFERENCES `pgms`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`bistudentfile`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`bistudentfile` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `bisid` INT(11) NOT NULL,
  `fid` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `fid_UNIQUE` (`fid` ASC) ,
  INDEX `bistudent_file_ref_bistudent_id_idx` (`bisid` ASC) ,
  CONSTRAINT `bistudent_file_ref_bistudent_id`
    FOREIGN KEY (`bisid`)
    REFERENCES `pgms`.`bistudent` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `bistudent_file_ref_file_id`
    FOREIGN KEY (`fid`)
    REFERENCES `pgms`.`file` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`lecture`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`lecture` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `content` TEXT NULL DEFAULT NULL,
  `start` DATETIME NOT NULL,
  `end` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`position`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`position` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(45) NOT NULL DEFAULT '',
  `device` VARCHAR(45) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `device_UNIQUE` (`device` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`lecture_position`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`lecture_position` (
  `lid` INT(11) NOT NULL,
  `pid` INT(11) NOT NULL,
  INDEX `lecture_position_rid_ref_lecture_id_idx` (`lid` ASC) ,
  INDEX `lecture_position_pid_ref_position_id_idx` (`pid` ASC) ,
  CONSTRAINT `lecture_position_pid_ref_position_id`
    FOREIGN KEY (`pid`)
    REFERENCES `pgms`.`position` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `lecture_position_rid_ref_lecture_id`
    FOREIGN KEY (`lid`)
    REFERENCES `pgms`.`lecture` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`logger`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`logger` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `ip` VARCHAR(45) NOT NULL,
  `url` VARCHAR(1024) NOT NULL,
  `uid` INT(11) NULL DEFAULT NULL,
  `response_body` TEXT NOT NULL,
  `response_status` INT(11) NOT NULL,
  `usertype` ENUM('student', 'teacher', 'admin', 'bistudent') NULL DEFAULT NULL,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `method` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `logger_uid_ref_user_id_idx` (`uid` ASC) ,
  CONSTRAINT `logger_uid_ref_user_id`
    FOREIGN KEY (`uid`)
    REFERENCES `pgms`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`migrations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`migrations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `run_on` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `pgms`.`student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`student` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `uid` INT(11) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  `sid` VARCHAR(16) NOT NULL,
  `email` VARCHAR(256) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `student_uid_ref_user_id_idx` (`uid` ASC) ,
  CONSTRAINT `student_uid_ref_user_id`
    FOREIGN KEY (`uid`)
    REFERENCES `pgms`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`record`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`record` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sid` INT(11) NOT NULL,
  `pid` INT(11) NOT NULL,
  `originId` INT(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `record_sid_ref_student_id_idx` (`sid` ASC) ,
  INDEX `record_pid_ref_position_id_idx` (`pid` ASC) ,
  CONSTRAINT `record_pid_ref_position_id`
    FOREIGN KEY (`pid`)
    REFERENCES `pgms`.`position` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `record_sid_ref_student_id`
    FOREIGN KEY (`sid`)
    REFERENCES `pgms`.`student` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`record_position`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`record_position` (
  `rid` INT(11) NOT NULL,
  `pid` INT(11) NOT NULL,
  INDEX `record_position_ref_record_id_idx` (`rid` ASC) ,
  INDEX `record_position_ref_position_id_idx` (`pid` ASC) ,
  CONSTRAINT `record_position_ref_position_id`
    FOREIGN KEY (`pid`)
    REFERENCES `pgms`.`position` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `record_position_ref_record_id`
    FOREIGN KEY (`rid`)
    REFERENCES `pgms`.`record` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`settings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`settings` (
  `key` VARCHAR(256) NOT NULL COMMENT 'key的选择如下:\n\nstage_count: number; 表示双选时总共的阶段数(这也是学生可以选择的老师总数)\ncurrent_stage: number; 表示当前的阶段数. 当值为-1时代表未开始, 当值为0是代表学生选择阶段(1,2,3...等代表老师选择阶段) 当值大于stage_count时代表已结束\nbegin_time: string; 一个可以格式化为date的字符串, 代表当前阶段开始时间\nend_time: string; 一个可以格式化为date的字符串, 代表当前阶段的结束时间 // 当当前时间位于两个时间之间时, 代表某个身份可以选择',
  `value` VARCHAR(2048) NOT NULL DEFAULT '{\"value\": 0}' COMMENT '这个value是一个json, 以便于保存不同属性的数据\n其格式为:\n{\"value\": 1} 或 {\"value\": \"done\"}\n',
  `lastUpdate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastUpdateAdmin` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`key`),
  INDEX `settings_admin_ref_admin_id_idx` (`lastUpdateAdmin` ASC) ,
  CONSTRAINT `settings_admin_ref_admin_id`
    FOREIGN KEY (`lastUpdateAdmin`)
    REFERENCES `pgms`.`admin` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`teacher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`teacher` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `uid` INT(11) NOT NULL,
  `name` VARCHAR(16) NOT NULL,
  `email` VARCHAR(256) NULL DEFAULT '',
  `personal_page` VARCHAR(256) NULL DEFAULT '',
  `research_area` TEXT NULL DEFAULT NULL,
  `bichoice_config` VARCHAR(2048) NOT NULL DEFAULT '{}' COMMENT '规定了这个老师的双选可选情况\n其内容是一个json,格式为\n{\n\"enrols\": [{\"id\": 1, \"num\": 3}, {\"id\": 2, \"num\": 1}],\n\"degrees\": [{\"id\": 1, \"num\": 3}, {\"id\": 2, \"num\": 1}]\n}\n保证这个序列是可json化的',
  `selected_students` VARCHAR(1024) NOT NULL DEFAULT '[]' COMMENT '列出了这个老师选择的学生\n这个字段是一个二维数组, 一维索引代表志愿顺序, 例如\n[[1,2,3],[4,5,6],[7,8,9]]\n表示在第一阶段上选择了1,2,3学生\n\n保证这个序列是可json化的',
  PRIMARY KEY (`id`),
  INDEX `teacher_id_ref_user_uid_idx` (`uid` ASC) ,
  CONSTRAINT `teacher_uid_ref_user_id`
    FOREIGN KEY (`uid`)
    REFERENCES `pgms`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`student_teacher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`student_teacher` (
  `sid` INT(11) NOT NULL,
  `tid` INT(11) NOT NULL,
  UNIQUE INDEX `sid_UNIQUE` (`sid` ASC) ,
  INDEX `student_teacher_sid_ref_student_id_idx` (`sid` ASC) ,
  INDEX `student_teacher_tid_ref_teacher_id_idx` (`tid` ASC) ,
  CONSTRAINT `student_teacher_sid_ref_student_id`
    FOREIGN KEY (`sid`)
    REFERENCES `pgms`.`student` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `student_teacher_tid_ref_teacher_id`
    FOREIGN KEY (`tid`)
    REFERENCES `pgms`.`teacher` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `pgms`.`token`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pgms`.`token` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'token的Id',
  `uid` INT(11) NOT NULL COMMENT 'user表的外键',
  `value` VARCHAR(1024) NOT NULL COMMENT '该用户的value值',
  `lastUpdate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'token更新的时间,根据这个判断用户的登录是否仍然保持有效',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uid_UNIQUE` (`uid` ASC) ,
  CONSTRAINT `token_uid_ref_user_id`
    FOREIGN KEY (`uid`)
    REFERENCES `pgms`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
