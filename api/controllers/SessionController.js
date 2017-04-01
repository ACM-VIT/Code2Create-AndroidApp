var bcrypt = require('bcryptjs');
var senderid;

// var bcrypt = require('bcrypt');
module.exports = {

  'welcome': function (req, res) {
    return res.status(200).json({
      user : 1
    })
  },

  'new': function (req, res) {
    if(req.session.authenticated)
    {
      res.redirect('/session/welcome');
      return;
    }
    res.view();
  },

  create: function (req, res, next) {

    if (!req.param('email') || !req.param('password')) {
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
          message: 'The email address ' + req.param('email') + ' not found.'
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

        bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid) {

          if (err) return next(err);

          // If the password from the form doesn't match the password from the database...
          if (!valid) {
            var usernamePasswordMismatchError = [{
              name: 'usernamePasswordMismatch',
              message: 'Invalid username and password combination.'
            }]
            req.session.flash = {
              err: 'Invalid username and password combination.'
            }
            console.log(err);
            return res.status(200).json(err);
          }

          req.session.authenticated = true;
          req.session.User = user;

          return res.status(200).json({
            user : user,
            token : sailsTokenAuth.issueToken(user.id),
            success : true
          })

          // return res.json(
          //   user: user,
          //   token : jwToken.issue({id: user.id}
          //   );
          // res.redirect('/session/welcome');
        });
      }

    });
  },

  checktoken : function (req, res, next) {
    temptoken = req.param('id');
    User.findOne({
      token : req.param('id')
    }, function foundUser(err, user) {
      if (!user) {
        console.log("Enters 4");

        return res.status(200).json({
          success : false,
          err : "The email address not found"
        });
      }
      else{
        return res.status(200).json({
          user : user,
          success : true
        })

      }

    });

      },


  destroy: function (req, res, next) {

    User.findOne(req.session.User.id, function foundUser(err, user) {

      var userId = req.session.User.id;

      if (user) {
        // The user is "logging out" (e.g. destroying the session) so change the online attribute to false.
        User.update(userId, {
          online: false
        }, function (err) {
          if (err) return next(err);

          // Inform other sockets (e.g. connected sockets that are subscribed) that the session for this user has ended.
          User.publishUpdate(userId, {
            loggedIn: false,
            id: userId,
            name: user.name,
            action: ' has logged out.'
          });

          // Wipe out the session (log out)
          req.session.destroy();

          // Redirect the browser to the sign-in screen
          res.redirect('/session/new');
        });
      } else {

        // Wipe out the session (log out)
        req.session.destroy();

        // Redirect the browser to the sign-in screen
        res.redirect('/session/new');
      }
    });
  }
};

