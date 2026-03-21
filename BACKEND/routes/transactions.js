const router = require("express").Router();
let Transaction = require("../models/Transaction");

// Create (Issue a new book)
router.route("/").post((req, res) => {
    const { studentName, studentId, bookTitle, bookAuthor, issueDate, dueDate, status } = req.body;

    const newTransaction = new Transaction({
        studentName,
        studentId,
        bookTitle,
        bookAuthor,
        issueDate,
        dueDate,
        status: status || "Borrowed"
    });

    newTransaction.save()
        .then(() => {
            res.json("Transaction Added Successfully and Book Issued.");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Error issuing book", details: err.message });
        });
});

// Read (Get all circulation transactions)
router.route("/").get((req, res) => {
    Transaction.find().sort({ createdAt: -1 })
        .then((transactions) => {
            res.json(transactions);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error fetching transactions" });
        });
});

// Read (Get one transaction by id)
router.route("/:id").get((req, res) => {
    let transactionId = req.params.id;
    Transaction.findById(transactionId)
        .then((transaction) => {
            res.status(200).json(transaction);
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).json({ status: "Error fetching transaction", error: err.message });
        });
});

// Update (Return a book / Update status)
router.route("/:id").put(async (req, res) => {
    let transactionId = req.params.id;
    // For returning a book, we might pass status: "Returned", returnDate: now, and calculated fine.
    const { studentName, studentId, bookTitle, bookAuthor, issueDate, dueDate, returnDate, status, fine } = req.body;

    const updateTx = {
        studentName,
        studentId,
        bookTitle,
        bookAuthor,
        issueDate,
        dueDate,
        returnDate,
        status,
        fine
    };

    await Transaction.findByIdAndUpdate(transactionId, updateTx)
        .then(() => {
            res.status(200).send({ status: "Transaction updated correctly." });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "Error updating transaction", error: err.message });
        });
});

// Delete (Void a transaction completely)
router.route("/:id").delete(async (req, res) => {
    let transactionId = req.params.id;

    await Transaction.findByIdAndDelete(transactionId)
        .then(() => {
            res.status(200).send({ status: "Transaction voided/deleted" });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error deleting transaction", error: err.message });
        });
});

// Set Return Status easily
router.route("/return/:id").post(async (req, res) => {
    let transactionId = req.params.id;
    const { fine } = req.body;

    await Transaction.findByIdAndUpdate(transactionId, {
        status: "Returned",
        returnDate: new Date(),
        fine: fine || 0
    })
    .then(() => {
        res.status(200).send({ status: "Book successfully marked as returned." });
    })
    .catch((err) => {
        console.log(err.message);
        res.status(500).send({ status: "Error returning book", error: err.message });
    });
});


module.exports = router;
