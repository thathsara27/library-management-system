require("dotenv").config();
const mongoose = require("mongoose");
const URL = process.env.MONGODB_URL;

mongoose.connect(URL, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log("MongoDB connection successful!");
        process.exit(0);
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err.message);
        process.exit(1);
    });
