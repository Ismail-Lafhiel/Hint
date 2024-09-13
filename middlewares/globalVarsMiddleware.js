module.exports = (req, res, next) => {
  res.locals.isAuthenticated = req.session.user ? true : false;
  res.locals.user = req.session.user || null; 
  next();
};
