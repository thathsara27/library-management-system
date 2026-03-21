const mongoose = require("mongoose");
const Member = require("./models/Member");

const m = new Member({
    name: "John",
    class: "10-C",
    admissionNumber: "123",
    address: "Home",
    phone: "444"
});

console.log("Model initialized:", m.toObject());
const err = m.validateSync();
console.log("Validation error:", err ? err.message : "None");
process.exit(0);
