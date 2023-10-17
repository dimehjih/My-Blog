const mongoose = require("mongoose")
const express = require("express")
const passport = require("passport")
const bodyParser = require('body-parser');
require('dotenv').config()
const db = require("./db")

const authRoute = require("./routes/auth")
const blogRoute = require("./routes/blogs/unprotectedBlog");
const pblogRoute = require("./routes/blogs/blogsprotected");
//const pblogRoute = require("./routes/blogs/blogsprotected")

require("./authentication/auth") // Signup and login authentication middleware

const PORT= 3463
const app = express();

// Connect to MongoDB
db.connectToMongoDB();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", authRoute);
app.use("/blog", blogRoute)
app.use("/blog/auth", passport.authenticate('jwt', { session: false }), pblogRoute);



app.get("/", (req, res) => {
    res.status(200).send("Welcome");
})


// Handle errors.
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});


app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
})





