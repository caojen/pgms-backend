'use strict';
var fs = require('fs');
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

exports.up = function(db) {
  fs.readFile('migrations/feedback.sql', {encoding: 'utf-8'}, (err, data) => {
    // console.log(err, data);
    if(err) {
      return console.log(err);
    } else {
      db.runSql(data, (err) => {
        if(err) {
          return console.log(err);
        } else {
          callback();
        }
      });
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
