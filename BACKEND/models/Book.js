const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    shelfLocation: {
        type: String
    },
    supplier: {
        type: String
    },
    description: {
        type: String
    },
    coverImage: {
        type: String // We'll store this as a string URL or placeholder for now
    }
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
