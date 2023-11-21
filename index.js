const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNEWUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('Connected to the database');
}).catch ((err) => {
    console.log(err);
});

app.use(express.json());
app.use(helmet());
app.use(morgan());

app.get("/", (req, res) => {
    res.send("Welcome to homepage")
});

app.get("/users", (req, res) => {
    res.send("Users Page")
});

app.listen(8800, () => {
    console.log("Backend Server is running")
});