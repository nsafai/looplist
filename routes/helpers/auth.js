exports.requireLogin = (req, res, next) => {
  // console.log("The following URL is requesting a login-gated page/action: " + req.originalUrl);
  if (req.session && req.session.user) {
    return next()
  }
  return res.redirect('/login')
}
