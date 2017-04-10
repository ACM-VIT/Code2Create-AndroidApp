

module.exports = {


  create : function(req, res, next) {

    var us_startTime = req.param('startTime');
    var us_qArray = req.param('qArray');
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
    var i = 0;


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
        }
        quiz.started = true;
        for (var i = 1; i < us_qArray.length ; i++) {
          if(parseInt(us_qArray[i]>-1)) {
            qarray.push(parseInt(us_qArray[i]));
          }
        }
        console.log(qarray[0]);
        quiz.qArray = qarray;
        quiz.lastQ = quiz.qArray[0];
        quiz.userid = user.id;

        quiz.save(
          function (err) {
            return res.status(200).json({
                success: true,
                message: "Successfully created quiz",
                quiz: quiz
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
            success: false,
            message: "Cannot change last question"
          })
        }
        if(!quiz){
          return res.status(200).json({
            started : false,
            finished : false,
            isLive : true,
            success: true

          });
        }

        return res.status(200).json({
          finished : quiz.finished,
          quiz : quiz,
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

      Quiz.update({
        userid: user.id
      }, update_params_given, function quizUpdated(err) {
        if (err) {
          return res.status(200).json({
            success : false,
            message : "Cannot change last question"
          })

        }

        return res.status(200).json({
          success : true,
          message : "Changed last question",
        })

      });
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

      //return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    }

    var d = new Date();
    var milliSec = formatDate(d);
    console.log("Finish time is");
    console.log(milliSec);

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

        quiz.finishTime = finishTime;



        if(Math.abs(milliSec - quiz.startTime)> 120000) {
          quiz.finishTime = milliSec
        }

        quiz.marks = req.param('marks');
        timeDifference = quiz.finishTime - quiz.startTime;
        console.log(timeDifference);
        console.log(quiz.marks);


        quiz.score = timeDifference/(quiz.marks);
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
                message: "Successfully created quiz",
                quiz: quiz
              }
            )

          }
        );
      });
    })
  },













};

