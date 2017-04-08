
module.exports = {
  details : function (req, res, next) {

    temptoken = req.param('id');

    Team.findOne({
      token : req.param('id')
    }).exec(function(err, user) {
    })
  },


  myteam : function(req, res, next) {
    var userid = 0;
    var temp = 0;
    var count = 0;
    var teammembers = [];
    var c=0;
    var teammembersemail = [];
    var ADMIN = "";


    User.findOne({
      token : req.param('id')
    }, function foundUser(err, user) {

      if(!user){
        return res.status(200).json({
          success : false,
          message : "Sorry,no user found."
        })
      }

      Team.findOne({
        admin: user.id
      }).then(function (team) {


        if (team) {
          temp = 1;

          ADMIN = user.name;
          for(var i=0 ; i<team.memberAccepted.length; i++){
            // teammembers.push(team.memberAccepted[i]);

            User.findOne({
              id : team.memberAccepted[i]
            }, function foundUser(err, tempuser) {
              c=c+1;
              teammembers.push(tempuser.name);
              teammembersemail.push(tempuser.email);
              if(c === team.memberAccepted.length) {
                res.status(200).json({
                  teamName : team.teamName,
                  ADMIN : user.name,
                  tempusergender : user.gender,
                  tempuseremail : user.email,
                  teammembers : teammembers,
                  teammembersemail : teammembersemail,
                  admin: true,
                  success : true
                });
                return
              }

            })
          }
        }


        else {

          Team.find(function foundTeams(err, teams) {
            teams.forEach(function (team) {
              count = count + 1;
              for (var k = 0; k < team.memberAccepted.length; k++) {

                if (team.memberAccepted[k] === (user.id)) {

                    temp = 3;
                    count = 100000000;

                    for(var i=0 ; i<team.memberAccepted.length; i++){
                      // teammembers.push(team.memberAccepted[i]);

                      User.findOne({
                        id : team.memberAccepted[i]
                      }, function foundUser(err, tempuser) {
                        c=c+1;
                        if(team.admin === tempuser.id){

                          adminuser = tempuser
                        }
                        teammembers.push(tempuser.name);
                        teammembersemail.push(tempuser.email);

                        if(c === team.memberAccepted.length) {
                          res.status(200).json({
                            teamName : team.teamName,
                            ADMIN : adminuser.name,
                            tempusergender : adminuser.gender,
                            tempuseremail : adminuser.email,
                            teammembers : teammembers,
                            teammembersemail : teammembersemail,
                            admin: false,
                            success : true
                          });
                          return
                        }


                      })
                    }


                  //
                }

              }
            });

            if (count === teams.length) {

              // req.session.flash = {
              //   err: "You dont have any team."
              // };
              res.status(200).json({
                success : false,
                message : "You dont habe any team"
              });
              return;

            }
          });
          //
        }
      });

    })


  },




};

