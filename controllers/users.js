const User = require("../models/user.js");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
}


module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to wanderlust");
            res.redirect("/listings");
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login")
}

// module.exports.login = async (req, res) => {
//     req.flash("success", "welcome back to wanderlust");
//     let redirectUrl = res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl);
// }

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    if (!redirectUrl.includes("reviews") &&
        (redirectUrl.includes("delete") || redirectUrl.includes("_method=DELETE"))
    ) {
        return res.redirect("/listings");
    }
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are logged out")
        res.redirect("/listings")
    })
}