var bcrypt = require('bcryptjs');


module.exports = {
  'new' : function (req, res) {

    res.view();

  },


  // create : function(req, res, next) {
  //
  //   User.create(req.params.all(), function userCreated(err, user) {
  //     if (err) {
  //       //console.log(err);
  //       req.session.flash = {
  //         err: err
  //       };
  //       return res.status(200).json(err);
  //     }
  //
  //     req.session.authenticated = true;
  //     req.session.User = user;
  //     user.token = sailsTokenAuth.issueToken(user.id);
  //     user.save(function (err) {
  //       if(err){
  //         return res.state(200).json(err);
  //       }
  //       console.log("Saving user");
  //       res.json({user: user, token: sailsTokenAuth.issueToken(user.id)});
  //     });
  //
  //
  //   });
  // },




  userRegister: function (req, res, next) {

    if (!req.param('email')) {
      req.session.flash = {
        err: 'You must enter both a username/email and password.'
      };
      return res.status(200).json({
        success : false,
        err : "You must enter both a username/email and password"
      });    }

    User.findOne({
      or : [
        { username: req.param('email') },
        { email: req.param('email') }
      ]
    }).exec(function(err, user) {

      if (err){
        req.session.flash = {
          err: 'Error in logging'
        };
        return res.status(200).json({
          success : false,
          err : "Error in logging.Please fill details properly!"
        });
      }


      // If no user is found...
      if (!user) {
        var noAccountError = {
          name: 'noAccount',
          message: 'The email address not found.'
        };
        // req.session.flash = {
        //   err: 'The email address ' + req.param('email') + ' not found.'
        // };
        return res.status(200).json({
          success : false,
          err : "The email address not found"
        });
      }
      else{

        // bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid) {

          // if (err) return next(err);
          //
          // // If the password from the form doesn't match the password from the database...
          // if (!valid) {
          //   var usernamePasswordMismatchError = [{
          //     name: 'usernamePasswordMismatch',
          //     message: 'Invalid username and password combination.'
          //   }]
          //   req.session.flash = {
          //     err: 'Invalid username and password combination.'
          //   }
          //   console.log(err);
          //   return res.status(200).json({
          //     success : false,
          //     message : "Wrong credentials.Please check your email or password. "
          //   });
          // }

          req.session.authenticated = true;
          req.session.User = user;
          user.registered = true;
          user.breakfast = 1;
          user.lunch = 1;
          user.dinner = 1;
          user.snacks = 1;
          user.coffee = 1;

          user.save(function (err) {
            if(err){
              return res.status(200).json({
                message : "Oops! Something went wrong while registering.",
                success : true
              })
            }
            return res.status(200).json({
              message : "Successfully registered!",
              success : true
            })
          });

        //});
      }

    });
  },

  // show: function(req, res, next) {
  //   User.findOne(req.param('id'), function foundUser(err, user) {
  //     if (err) return next(err);
  //     if (!user) return next();
  //     res.view({
  //       user: user
  //     });
  //   });
  // }




  // index : function(req, res, next){
  //
  //   User.find(function foundUsers(err, users){
  //     if(err) return next(err);
  //     return res.status(200).json({
  //       users : users
  //     })
  //   });
  // }
  //this function is used for returning all the users in form of array.


};





