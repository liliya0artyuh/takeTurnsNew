'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  // MongoDB connection options
  mongo: {
    uri:  process.env.MONGOLAB_URI ||
          process.env.MONGOHQ_URL ||
          process.env.OPENSHIFT_MONGODB_DB_URL +
          process.env.OPENSHIFT_APP_NAME ||
          'mongodb://heroku_5d7j4gdf:takeTurns14@ds143241.mlab.com:43241/heroku_5d7j4gdf'
         //old deployment -  'mongodb://heroku_ggpdvnnq:75a091158mhgo99cc0rjia8ln8@ds011291.mlab.com:11291/heroku_ggpdvnnq'
  }
};
