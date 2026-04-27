const router = require("express").Router();
const Book = require("../models/Book");
const Transaction = require("../models/Transaction");
const Student = require("../models/Student");
const Notice = require("../models/Notice");

// Get dashboard summary data
router.route("/summary").get(async (req, res) => {
    try {
        // Run all queries in parallel for maximum speed
        const [
            booksResult,
            issuedCount,
            overdueCount,
            newStudents,
            recentTx,
            recentNotices
        ] = await Promise.all([
            // 1. Total Books (Sum of quantity, defaulting to 1 if missing)
            Book.aggregate([
                {
                    $project: {
                        quantityValue: { $ifNull: ["$quantity", 1] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalBooks: { $sum: "$quantityValue" }
                    }
                }
            ]),
            
            // 2. Issued Books Count
            Transaction.countDocuments({ status: "Borrowed" }),
            
            // 3. Overdue Books Count
            Transaction.countDocuments({ 
                status: "Borrowed", 
                dueDate: { $lt: new Date() } 
            }),
            
            // 4. Total Students
            Student.countDocuments(),
            
            // 5. Recent Transactions
            Transaction.find()
                .sort({ createdAt: -1 })
                .limit(4),
                
            // 6. Recent Notices (Exclude coverImage to keep payload small)
            Notice.find()
                .select("-coverImage")
                .sort({ isPinned: -1, createdAt: -1 })
                .limit(3)
        ]);

        const totalBooksCount = booksResult.length > 0 ? booksResult[0].totalBooks : 0;

        res.json({
            metrics: {
                totalBooks: totalBooksCount,
                issuedBooks: issuedCount,
                newStudents: newStudents,
                overdueBooks: overdueCount
            },
            recentTx: recentTx,
            recentNotices: recentNotices
        });

    } catch (err) {
        console.error("Error fetching dashboard summary:", err);
        res.status(500).json({ error: "Error fetching dashboard summary", details: err.message });
    }
});

module.exports = router;
