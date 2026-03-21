const router = require("express").Router();
let Book = require("../models/Book");

// Create (Add new book)
router.route("/").post((req, res) => {
    const { title, author, isbn, category, quantity, shelfLocation, supplier, description, coverImage } = req.body;

    const newBook = new Book({
        title,
        author,
        isbn,
        category,
        quantity,
        shelfLocation,
        supplier,
        description,
        coverImage
    });

    newBook.save()
        .then(() => {
            res.json("Book Added Successfully");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Error adding book", details: err.message });
        });
});

// Read (Get all books)
router.route("/").get((req, res) => {
    Book.find().sort({ createdAt: -1 })
        .then((books) => {
            res.json(books);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error fetching books" });
        });
});

// Update (Edit book info)
router.route("/:id").put(async (req, res) => {
    let bookId = req.params.id;
    const { title, author, isbn, category, quantity, shelfLocation, supplier, description, coverImage } = req.body;

    const updateBook = {
        title,
        author,
        isbn,
        category,
        quantity,
        shelfLocation,
        supplier,
        description,
        coverImage
    };

    await Book.findByIdAndUpdate(bookId, updateBook)
        .then(() => {
            res.status(200).send({ status: "Book updated" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "Error updating book data", error: err.message });
        });
});

// Delete (Remove book)
router.route("/:id").delete(async (req, res) => {
    let bookId = req.params.id;

    await Book.findByIdAndDelete(bookId)
        .then(() => {
            res.status(200).send({ status: "Book deleted" });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error deleting book", error: err.message });
        });
});

// Read One (Get single book)
router.route("/:id").get(async (req, res) => {
    let bookId = req.params.id;
    await Book.findById(bookId)
        .then((book) => {
            res.status(200).send({ status: "Book fetched", book });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error fetching book", error: err.message });
        });
});

module.exports = router;
