module.exports = function(req, res, next) {
  var token;

  if (req.headers && req.headers.authorization) {
    console.log("Enterd into 1st if in tokenAuth");
    var parts = req.headers.authorization.split(' ');
    console.log(parts);
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
        console.log("token is in if")
        console.log(token)
      }
    } else {
      return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
    }
  } else if (req.param('token')) {
    console.log("Entered into elseif req.param.header");
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.json(401, {err: 'No Authorization header was found'});
  }
  console.log("Again printing token" + token);

  sailsTokenAuth.verifyToken(token, function(err, token) {
    console.log("error is");
    console.log(err);
    console.log("token is");
    console.log(token);
    if (err) return res.json(401, {err: 'The token is not valid'});

    console.log('Successfully reached here');
    req.token = token;

    next();
  });
};
