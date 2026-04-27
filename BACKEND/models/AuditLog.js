const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const auditLogSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String
    }
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
