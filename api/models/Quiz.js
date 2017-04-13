/**
 * Quiz.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    userid : {
      type : 'string'
    },

    isLive : {
      type : 'integer',
      required : false,
      defaultsTo : 0
    },

    started : {
      type : 'boolean',
      required : false,
      defaultsTo : false

    },

    finished : {
      type : 'boolean',
      required : false,
      defaultsTo : false

    },

    qArray : {
      type : 'array',
      required : false
    },

    lastQ : {
      type : 'integer',
      required : false,
      defaultsTo : 0
    },

    startTime : {
      type : 'float'
    },


    finishTime : {
      type : 'float'
    },

    marks : {
      type : 'integer'
    },

    score : {
      type : 'float'
    }

  }
};

