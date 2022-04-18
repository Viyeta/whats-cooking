"use strict";

const MongoClient = require("mongodb").MongoClient;
var env = process.env.NODE_ENV || "development";
const config = require("./config")[env];
const mongoConfig = config;

// const settings = {
//   mongoConfig: {
//     serverUrl: "mongodb://localhost:27017/",
//     database: "ProjectDB",
//   },
// };
// const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = {
  connectToDb: async () => {
    if (!_connection) {
      if(env == "production") {
        let url = "mongodb+srv://" + process.env.DBUser + ":" + process.env.DBPassword + "@" + process.env.DBHost + "/" + process.env.DBName + "?retryWrites=true&w=majority";
        _connection = await MongoClient.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        _db = await _connection.db(process.env.DBName);
      } else {
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        _db = await _connection.db(mongoConfig.database);
      }
    }

    return _db;
  },
  closeConnection: () => {
    _connection.close();
  },
  env,
};
