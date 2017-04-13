
var coupon_type;
var adminId;

module.exports = {

  redeem : function (req, res, next) {

    coupon_type = req.param('coupon_type');
    adminId = req.param('adminId');

    User.findOne({
      id: req.param('id')
    }, function foundUser(err, user) {

      if (!user) {
        return res.status(200).json({
          success: false,
          message: "Sorry,no user found."
        })
      }

      if(adminId === "VinitSourish#12") {
        if (user.registered === true) {
          if (coupon_type === "breakfast") {
            if (user.breakfast > 0) {
              user.breakfast = user.breakfast - 1;
            }
            else {
              return res.status(200).json({
                message: "Sorry, cannot use coupon twice"
              })
            }
          }
          else if (coupon_type === "lunch") {
            if (user.lunch > 0) {
              user.lunch = user.lunch - 1;
            }
            else {
              return res.status(200).json({
                message: "Already reverted once"
              })
            }
          }
          else if (coupon_type === "dinner") {
            if (user.dinner > 0) {
              user.dinner = user.dinner - 1;
            }
            else {
              return res.status(200).json({
                message: "Sorry, cannot use coupon twice"
              })
            }
          }

          else if (coupon_type === "snacks") {
            if (user.snacks > 0) {
              user.snacks = user.snacks - 1;
            }
            else {
              return res.status(200).json({
                message: "Sorry, cannot use coupon twice"
              })
            }
          }

          else if (coupon_type === "coffee") {
            if (user.coffee > 0) {
              user.coffee = user.coffee - 1;
            }
            else {
              return res.status(200).json({
                message: "Sorry, cannot use coupon twice"
              })
            }
          }
          else {
            return res.status(200).json({
              success: true,
              message: "Invalid coupon type"
            })
          }
          user.save(function (err) {
            return res.status(200).json({
              success: true,
              message: "Successfully redeemed coupon",
              user: user
            })
          });

        }
        else {
          return res.status(200).json({
            success: true,
            message: "User is not registered"
          })
        }
      }
      else{
        return res.status(200).json({
          message : "Oops! You are not admin."
        })
      }

    });
  },

  revert : function (req, res, next) {

    coupon_type = req.param('coupon_type');
    adminId = req.param('adminId');


    User.findOne({
      id: req.param('id')
    }, function foundUser(err, user) {

      if (!user) {
        return res.status(200).json({
          success: false,
          message: "Sorry,no user found."
        })
      }

      if(adminId === "VinitSourish#12") {
        if (user.registered === true) {
          if (coupon_type === "breakfast") {
            if (user.breakfast < 1) {
              user.breakfast = user.breakfast + 1;
            }
            else {
              return res.status(200).json({
                message: "."
              })
            }
          }
          else if (coupon_type === "lunch") {
            if (user.lunch < 1) {
              user.lunch = user.lunch + 1;
            }
            else {
              return res.status(200).json({
                message: "Already reverted once."
              })
            }
          }
          else if (coupon_type === "dinner") {
            if (user.dinner < 1) {
              user.dinner = user.dinner + 1;
            }
            else {
              return res.status(200).json({
                message: "Already reverted once."
              })
            }
          }

          else if (coupon_type === "snacks") {
            if (user.snacks < 1) {
              user.snacks = user.snacks + 1;
            }
            else {
              return res.status(200).json({
                message: "Already reverted once."
              })
            }
          }

          else if (coupon_type === "coffee") {
            if (user.coffee < 1) {
              user.coffee = user.coffee + 1;
            }
            else {
              return res.status(200).json({
                message: "Already reverted once."
              })
            }
          }
          else {
            return res.status(200).json({
              success: true,
              message: "Invalid coupon type"
            })
          }

          user.save(function (err) {
            return res.status(200).json({
              success: true,
              message: "Successfully redeemed coupon",
              user: user
            })
          });
        }
        else {
          return res.status(200).json({
            success: true,
            message: "User is not registered"
          })
        }
      }
      else{
        return res.status(200).json({
          message : "Oops! You are not admin."
        })
      }


    });
  },

  updateCoupons : function (req, res, next) {

    User.find(function foundUsers(err, users){
      if(err) return next(err);

      users.forEach(function (user) {
        if(user.registered) {
          user.coffee = 1;
          user.snacks = 1;
          user.save();
          // user.breakfast = -1000000;
          // user.lunch = -1000000;
          // user.dinner = -1000000;
        }
      });

      return res.status(200).json({
        message : "Successfully updated all coupons"
      })


    });

  }





};





































