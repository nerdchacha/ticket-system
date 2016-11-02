var log4js = require('log4js');

log4js.configure({
  "appenders": [
      {
          "type": "file",
          "filename": "log/tmp-debug.log",
          "maxLogSize": 1024,
          "backups": 3,
          "category": "debug"
      }
  ]
});

log = log4js.getLogger("debug");

module.exports = log;