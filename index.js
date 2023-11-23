const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const PORT = process.env.PORT || 8800;
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Connected to the database');
}).catch ((err) => {
    console.log('Error connecting to the database:', err);
});

//Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
    res.send("Welcome to homepage")
}); 

app.listen(PORT, () => {
    console.log("Backend Server is running")
});

module.exports = app;