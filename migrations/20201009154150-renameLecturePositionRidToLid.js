'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.runSql(`alter table lecture_position change column rid lid integer`, (err) => {
    if(err) {
      throw new Error();
    } else {
      callback()
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
