try {
  function adminAuth(req, res, next) {
    if (req.session.user != undefined) {
      next();
    } else {
      res.redirect("/admin/login");
    }
  }
} catch (error) {
  res.redirect("/");
}

module.exports = adminAuth;
