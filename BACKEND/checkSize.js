const mongoose = require("mongoose");
const Book = require("./models/Book");
const Notice = require("./models/Notice");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL).then(async () => {
    const books = await Book.find({});
    let totalBookImgSize = 0;
    for (const b of books) {
        if (b.coverImage) totalBookImgSize += b.coverImage.length;
    }
    
    const notices = await Notice.find({});
    let totalNoticeImgSize = 0;
    for (const n of notices) {
        if (n.coverImage) totalNoticeImgSize += n.coverImage.length;
    }
    
    console.log(`Total Book Image Data Size: ${(totalBookImgSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total Notice Image Data Size: ${(totalNoticeImgSize / 1024 / 1024).toFixed(2)} MB`);
    
    process.exit(0);
}).catch(console.error);
