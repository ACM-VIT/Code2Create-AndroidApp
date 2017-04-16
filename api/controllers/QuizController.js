// Enteres into create
// 2017-04-14T17:53:45.492953+00:00 app[web.1]: 21180481
// 2017-04-14T17:53:45.510844+00:00 app[web.1]: Finally here it is
// 2017-04-14T17:53:45.525111+00:00 app[web.1]: 01



var isLive = false;
var moment = require('moment');
module.exports = {


  create : function(req, res, next) {


    var us_startTime = req.param('startTime');
    var qArray = req.param('qArray');
    var us_qArray = [];
    us_qArray = req.param('qArray');
    var temp = [];
    var qarray = [];
    var allow = 0;

    /////time calculation

    function formatDate(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var milliseconds = date.getMilliseconds();

      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes;

      totalTime = hours*60*60*1000 + minutes*60*1000 + milliseconds;
      return totalTime;

      //return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    }

    var d = new Date();
    var milliSec = formatDate(d);
    /////end
    var params_needed = {
      startTime: us_startTime,
      qArray : qArray
      // qArray: us_qArray
    };
    User.findOne({
      token: req.param('token')
    }, function foundUser(err, user) {

      if (!user) {
        return res.status(200).json({
          success: false,
          message: "Sorry,no user found."
        })
      }
      else {
        Quiz.create(req.params.all(), function quizCreated(err, quiz) {
          
            if (err) {
              console.log("Entering into err");

              return res.status(200).json({
                message: "Quiz already created"
              });
            }

            // quiz.startTime = req.param('startTime');


          else{

                console.log("Here is the time");
                console.log(quiz.startTime);
                console.log(milliSec);

                if (Math.abs(milliSec + 1492171235397 - quiz.startTime) > 120000) {
                  quiz.startTime = milliSec + 1492171235397;
                }
                quiz.started = true;
                quiz.marks = 0;


                for (var i = 0; i < us_qArray.length; i++) {
                  if (parseInt(us_qArray[i])) {
                    qarray.push(parseInt(us_qArray[i]));
                  }
                }
                quiz.qArray = qarray;
                quiz.lastQ = -1;
                quiz.userid = user.id;

                quiz.save(
                  function (err) {
                    if (err) {
                      message : "There is error in creating quiz"
                    }
                    return res.status(200).json({
                        success: true,
                        message: "Successfully created quiz"
                      }
                    )

                  }
                );
              }


            // else {
            //   return res.status(200).json({
            //       success: true,
            //       message: "Already created quiz"
            //     }
            //   )
            //
            // }
          });

      }
    });
  },

  getData : function (req, res, next) {




    User.findOne({
      token: req.param('id')
    }, function foundUser(err, user) {

      if (!user) {
        return res.status(200).json({
          success: false,
          message: "Sorry,no user found."
        })
      }

      Quiz.findOne({
        userid: user.id
      }, function foundQuiz(err, quiz) {
        if (err) {
          return res.status(200).json({
            success: true,
            message: "Cannot change last question"
          })
        }
        if(!quiz){
          return res.status(200).json({
            started : false,
            finished : false,
            isLive : isLive,
            //-------------changes------------//
            success: true

          });
        }

        return res.status(200).json({
          quiz : quiz,
          started : quiz.started,
          finished : quiz.finished,
          isLive : isLive,
          success: true
        });
      })
    })

  },
  update : function(req,res,next){

    var lastQuestion = req.param('lastQ');
    var marks = req.param('marks');
    var timeDifference;

    var update_params_given = {
      lastQ: lastQuestion,
      marks : marks

    };


    User.findOne({
      token: req.param('id')
    }, function foundUser(err, user) {

      if (!user) {
        return res.status(200).json({
          success: false,
          message: "Sorry,no user found."
        })
      }




      Quiz.findOne({
          userid : user.id
        },
        function foundQuiz(err, quiz){
          if(err) {
            return res.status(200).json({
              success : true,
              message : "Something went wrong,cannot update."
            })
          }
          if(!quiz){
            return res.status(200).json({
              success : true,
              message : "No quiz found"
            })
          }

          if(isLive) {

            if (quiz.lastQ < lastQuestion) {
              quiz.marks = marks;
              quiz.lastQ = lastQuestion;
              quiz.save(function (err) {
                if (err) {
                  return res.status(200).json({
                    success: true,
                    isLive : isLive,
                    message: "Cannot change last question"
                  })
                }
                return res.status(200).json({
                  success: true,
                  isLive : isLive,
                  message: "Successfully changed last question"
                })

              })
            }
            else{

              return res.status(200).json({
                success: true,
                isLive : isLive,
                message: "Already updated last question."
              })

            }
          }
          else {
            return res.status(200).json({
              success: true,
              isLive: true,
              message: "Quiz is over!"
            });
          }

        });

      // Quiz.update({
      //   userid: user.id
      // }, update_params_given, function quizUpdated(err) {
      //   if (err) {
      //     return res.status(200).json({
      //       success : false,
      //       message : "Cannot change last question"
      //     })
      //
      //   }
      //
      //   return res.status(200).json({
      //     success : true,
      //     message : "Changed last question",
      //   })
      //
      // });
    })
  },

  // index : function(req, res, next){
  //
  //   Quiz.find(function foundQuizs(err, quizs){
  //     if(err) return next(err);
  //     return res.status(200).json({
  //       quizs : quizs
  //     })
  //   });
  // },

  finishQuiz : function (req, res, next) {


    var timeDifference = 0;

    var finishTime = req.param('finishTime');

    /////time calculation

    function formatDate(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var milliseconds = date.getMilliseconds();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes;

      totalTime = hours*60*60*1000 + minutes*60*1000 + milliseconds;
      return totalTime;

    }

    var d = new Date();
    var milliSec = formatDate(d);

    ///end


    User.findOne({
      token: req.param('id')
    }, function foundUser(err, user) {

      if (!user) {
        return res.status(200).json({
          success: false,
          message: "Sorry,no user found."
        })
      }

      Quiz.findOne({
        userid: user.id
      }, function foundQuiz(err, quiz) {
        if (err) {
          return res.status(200).json({
            success : false,
            message : "Cannot change last question"
          })
        }

        if(!quiz){
          return res.status(200).json({
            success : true,
            message : "No quiz found"
          })
        }

        if(isLive) {
          if (!quiz.finished) {

            quiz.finishTime = finishTime;


            if (Math.abs(milliSec + 1492171235397 - quiz.finishTime) > 120000) {
              quiz.finishTime = milliSec + 1492171235397;
            }

            quiz.marks = req.param('marks');
            timeDifference = quiz.finishTime - quiz.startTime;


            quiz.score = 100000 * ((quiz.marks) / timeDifference);
            quiz.finished = true;

            quiz.save(
              function (err) {
                if (err) {
                  return res.status(200).json({
                    success: false,
                    message: "Something went wrong!"
                  })
                }
                return res.status(200).json({
                  success: true,
                  message: "Successfully finished quiz",
                  quiz: quiz
                })

              }
            );
          }
          else {
            return res.status(200).json({
              success: true,
              message: "Already finished quiz",
              quiz: quiz
            });
          }
        }
        else{
          return res.status(200).json({
            success: true,
            message: "Sorry! Quiz is not live",
            quiz: quiz
          });


        }

      });
    })
  }

};

