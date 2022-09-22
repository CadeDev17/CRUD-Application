exports.getHome = (req, res, next) => {
    res.render('./shop/home.ejs', {
        pageTitle: "DevSwag()",
        isAuthenticated: req.session.isLoggedIn
    })
}