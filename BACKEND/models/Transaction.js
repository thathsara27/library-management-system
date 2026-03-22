const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    studentName: {
        type: String,
        required: true
    },
    studentId: {
        type: String, // E.g., ST-9810
        required: true
    },
    bookTitle: {
        type: String,
        required: true
    },
    bookAuthor: {
        type: String,
        required: false
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['Borrowed', 'Returned'],
        default: 'Borrowed'
    },
    fine: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
