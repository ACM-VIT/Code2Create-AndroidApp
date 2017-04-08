/**
 * QuizController
 *
 * @description :: Server-side logic for managing quizzes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

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

  time : {
    type : 'integer'
  },

  score : {
    type : 'float'
  }


};

