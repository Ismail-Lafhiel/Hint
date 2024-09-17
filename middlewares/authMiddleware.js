module.exports = {
  // Middleware to redirect authenticated users away from login/register routes
  redirectIfAuthenticated: (req, res, next) => {
    if (req.session.user) {
      return res.redirect("/");
    }
    next();
  },

  // Middleware to redirect unauthenticated users from protected routes
  redirectIfNotAuthenticated: (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    next();
  },
};