exports.logoutUser = (req, res) => {
  if (!req.session) {
    console.error("Session is not initialized.");
    return res.redirect("/login");
  }
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        // req.session.errorMessage =
        //   "An error occurred while logging out. Please try again.";
        return res.redirect("/login");
      }

      //   req.session.successMessage = "You have been logged out successfully.";
      return res.redirect("/login");
    });
  } else {
    // req.session.errorMessage = "You are not logged in.";
    return res.redirect("/login");
  }
};
