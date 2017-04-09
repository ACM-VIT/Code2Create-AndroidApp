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
      type : 'boolean',
      required : false
    },

    started : {
      type : 'boolean',
      required : false
    },

    finished : {
      type : 'boolean',
      required : false
    },

    qArray : {
      type : 'array',
      required : false
    },

    lastQ : {
      type : 'string',
      required : false
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

