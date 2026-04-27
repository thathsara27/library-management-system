const mongoose = require("mongoose");
const Book = require("./models/Book");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL).then(async () => {
    console.log("Connected to MongoDB");
    const books = await Book.find({});
    let updatedCount = 0;
    
    for (const book of books) {
        if (book.coverImage && book.coverImage.length > 500000) { // If image is larger than ~500KB string
            console.log(`Book ${book._id} has a huge image (size: ${book.coverImage.length}). Clearing it...`);
            // Clear or shorten the image
            book.coverImage = "";
            await book.save();
            updatedCount++;
        }
    }
    
    console.log(`Finished checking. Updated ${updatedCount} books.`);
    process.exit(0);
}).catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});
