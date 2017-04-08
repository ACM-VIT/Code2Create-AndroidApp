module.exports = {
  'new' : function (req, res) {

    res.view();

  },


  create : function(req, res, next) {

    User.create(req.params.all(), function userCreated(err, user) {
      if (err) {
        //console.log(err);
        req.session.flash = {
          err: err
        };
        return res.status(200).json(err);
      }

      req.session.authenticated = true;
      req.session.User = user;
      user.token = sailsTokenAuth.issueToken(user.id);
      user.save(function (err) {
        if(err){
          return res.state(200).json(err);
        }
        console.log("Saving user");
        res.json({user: user, token: sailsTokenAuth.issueToken(user.id)});
      });


    });
  },

  show: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },




  index : function(req, res, next){

    User.find(function foundUsers(err, users){
      if(err) return next(err);
      return res.status(200).json({
        users : users
      })
    });
  },
  // //this function is used for returning all the users in form of array.
  //

};





