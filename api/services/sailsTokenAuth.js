var jwt = require('jsonwebtoken');
tokenSecret = "secretissecet";
module.exports.issueToken = function(payload) {
  // var token = jwt.sign(
  //                     payload,
  //                     process.env.TOKEN_SECRET || "our biggest secret", // Token Secret that we sign it with
  //                     {
  //                       expiresIn : 60*60*24
  //                      // Token Expire time
  //                     });
  console.log("Payload is " + payload);
  var token  = jwt.sign({user : payload}, tokenSecret, {
    expiresIn : '1h'
  });
  return token;
};

module.exports.verifyToken = function(token, verified) {
  console.log(token);
  return jwt.verify(token, tokenSecret || "our biggest secret", {}, verified);
};
