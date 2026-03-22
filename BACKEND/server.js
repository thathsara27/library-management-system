const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Best to keep this at the very top

const app = express();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

const studentRouter = require("./routes/students.js");
app.use("/api/students", studentRouter);

const supplierRouter = require("./routes/suppliers.js");
app.use("/api/suppliers", supplierRouter);

const noticeRouter = require("./routes/notices.js");
app.use("/api/notices", noticeRouter);

const bookRouter = require("./routes/books.js");
app.use("/api/books", bookRouter);

const transactionRouter = require("./routes/transactions.js");
app.use("/api/transactions", transactionRouter);

const authRouter = require("./routes/auth.js");
app.use("/api/auth", authRouter);

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
// Trigger nodemon restart