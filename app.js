if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
// const MongoStore = require('connect-mongo');
const { MongoStore } = require('connect-mongo');

const flash = require("connect-flash");

const dbUrl= process.env.ATLASDB_URL;


const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));                           //require schema
// const req = require("express/lib/request.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err)=>{
    console.log("ERROR in MONGO SESSION STORE", err)
})

const sessionOption = {
    store,
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}



app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





console.log("DB URL:", process.env.ATLASDB_URL);
console.log("SECRET:", process.env.SECRET);


async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("connected to db");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);

        setTimeout(() => {
            main();
        }, 5000);
    }
}
main();


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
})



app.get("/", (req, res) => {
    res.render("home.ejs");
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    console.log(err);
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
})




// app.listen(8080, () => {
//     console.log("server is listening to the port 8080");
// })


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("server is listening on", PORT);
});
