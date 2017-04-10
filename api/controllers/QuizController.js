

module.exports = {


  create : function(req, res, next) {

    var us_startTime = req.param('startTime');
    var us_qArray = [];
    us_qArray = req.param('qArray');
    var temp = [];
    var qarray = [];

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

      console.log(strTime);
      totalTime = hours*60*60*1000 + minutes*60*1000 + milliseconds;
      return totalTime;

      //return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    }

    var d = new Date();
    var milliSec = formatDate(d);
    console.log(milliSec);

    /////end


    var params_needed = {
      startTime: us_startTime,
      // qArray: us_qArray
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

      Quiz.create(req.params.all(), function quizCreated(err, quiz) {
        if (err) {
          return res.status(200).json({
            message: "Quiz cannot be started"
          });
        }

        if(Math.abs(milliSec - quiz.startTime)> 120000){
          quiz.startTime = milliSec
          //if sm1 changes system time,server time will be taken.
        }
        quiz.started = true;



        for (var i = 0; i < us_qArray.length ; i++) {
          console.log(parseInt(us_qArray[i]));
          if(parseInt(us_qArray[i])) {
            qarray.push(parseInt(us_qArray[i]));
          }
        }
        // console.log(qarray[0]);
        quiz.qArray = qarray;
        quiz.lastQ = quiz.qArray[0];
        quiz.userid = user.id;

        quiz.save(
          function (err) {
            return res.status(200).json({
                success: true,
                message: "Successfully created quiz"
              }
            )

          }
        );
      });
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
            isLive : true,
            //-------------changes------------//
            success: true

          });
        }

        return res.status(200).json({
          quiz : quiz,
          started : quiz.started,
          finished : quiz.finished,
          isLive : quiz.isLive,
          success: true
        });
      })
    })

  },
  update : function(req,res,next){

    var lastQuestion = req.param('lastQ');
    var marks = req.param('marks');

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

        if(quiz.isLive) {

          if (quiz.lastQ < lastQuestion) {
            quiz.marks = marks;
            quiz.lastQ = lastQuestion;
            quiz.save(function (err) {
              if (err) {
                return res.status(200).json({
                  success: true,
                  isLive : quiz.isLive,
                  message: "Cannot change last question"
                })
              }
              return res.status(200).json({
                success: true,
                isLive : quiz.isLive,
                message: "Successfully changed last question"
              })

            })
          }
          else{
            return res.status(200).json({
              success: true,
              isLive : quiz.isLive,
              message: "Already updated last question."
            })

          }
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

  index : function(req, res, next){

    Quiz.find(function foundQuizs(err, quizs){
      if(err) return next(err);
      return res.status(200).json({
        quizs : quizs
      })
    });
  },

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

      console.log(strTime);
      totalTime = hours*60*60*1000 + minutes*60*1000 + milliseconds;
      return totalTime;

    }

    var d = new Date();
    var milliSec = formatDate(d);

    /////end


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

        quiz.finishTime = finishTime;



        if(Math.abs(milliSec - quiz.startTime)> 120000) {
          quiz.finishTime = milliSec
        }

        quiz.marks = req.param('marks');
        timeDifference = quiz.finishTime - quiz.startTime;


        quiz.score = 10000000*((quiz.marks)/timeDifference);
        console.log(quiz.score);
        quiz.finished = true;

        quiz.save(
          function (err) {
            if(err){
              return res.status(200).json({
                success: false,
                message : "Something went wrong!"
              })
            }
            return res.status(200).json({
                success: true,
                message: "Successfully finished quiz",
                quiz: quiz
              }
            )

          }
        );
      });
    })
  }

};

