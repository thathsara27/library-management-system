const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noticeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String, // e.g., 'News', 'Event', 'Maintenance', 'New Arrival'
        required: true
    },
    content: {
        type: String,
        required: true
    },
    targetAudience: {
        type: String,
        default: 'All Users'
    },
    publishDate: {
        type: String, 
        required: true
    },
    publishTime: {
        type: String
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    status: {
        type: String, // e.g., 'Published', 'Draft', 'Archived'
        default: 'Published'
    },
    author: {
        type: String,
        default: 'Administrator'
    },
    coverImage: {
        type: String // To store base64 image string
    }
}, { timestamps: true });

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;

