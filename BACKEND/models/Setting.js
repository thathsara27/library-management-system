const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingSchema = new Schema({
    // Loan Rules
    maxBooks: { type: Number, default: 5 },
    loanPeriod: { type: Number, default: 14 },
    gracePeriod: { type: Number, default: 2 },
    
    // Fine Configuration
    dailyFine: { type: Number, default: 0.50 },
    currency: { type: String, default: 'LKR' },
    maxFine: { type: Number, default: 25.00 },
    autoBlocking: { type: Boolean, default: false },
    lostFee: { type: Number, default: 1500.00 },
    damageFee: { type: Number, default: 500.00 },
    
    // General Identity
    libraryName: { type: String, default: 'BookFlow Central' },
    email: { type: String, default: 'admin@bookflow.com' },
    phone: { type: String, default: '+94 11 234 5678' },
    
    // Notifications
    emailCheckout: { type: Boolean, default: true },
    emailReturn: { type: Boolean, default: true },
    smsOverdue: { type: Boolean, default: false }
}, { timestamps: true });

const Setting = mongoose.model("Setting", settingSchema);
module.exports = Setting;
