const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Best to keep this at the very top

const app = express();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL)
    .then(() => {
        console.log("MongoDB connection successful!");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });


const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});