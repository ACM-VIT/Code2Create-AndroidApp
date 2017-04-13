/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema : true,

  attributes: {

    email : {
      type: 'string',
      email : true,
      required: true,
      unique : true

    },
    token : {
      type : 'string'
    },

    encryptedPassword: {
      type: 'string'
    },


    breakfast: {
      type : "integer",
      defaultsTo : 1
    },

    lunch : {
      type : "integer",
      defaultsTo : 1

    },

    dinner : {
      type : "integer",
      defaultsTo : 1

    },

    snacks : {
      type : "integer",
      defaultsTo : 1

    },

    coffee : {
      type : "integer",
      defaultsTo : 1
    },

    registered : {
      type : "boolean",
      defaultsTo : false
    },


    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj._csrf;
      return obj;
    }
  },

  beforeCreate: function (values, next) {
    require('bcryptjs').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });
  }

};

