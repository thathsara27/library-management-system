const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    supplierName: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    category: {
        type: String, // e.g., 'Academic', 'Fiction', 'Journals'
        required: true
    },
    suppliedCount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
