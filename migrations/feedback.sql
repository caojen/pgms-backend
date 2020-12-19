create table if not exists `feedback` (
  `id` INT(11) not null auto_increment,
  `identify` VARCHAR(256) NOT NULL COMMENT '记录ip',
  `type` ENUM('forget-password', 'bug', 'feedback'),
  `detail` TEXT NOT NULL COMMENT '请根据type自定义detail',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
