const router = require("express").Router();
let Notice = require("../models/Notice");

// Create (Add new notice)
router.route("/").post((req, res) => {
    const { title, category, content, targetAudience, publishDate, publishTime, isPinned, status, author } = req.body;

    const newNotice = new Notice({
        title,
        category,
        content,
        targetAudience,
        publishDate,
        publishTime,
        isPinned,
        status,
        author
    });

    newNotice.save()
        .then(() => {
            res.json("Notice Added Successfully");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Error adding notice", details: err.message });
        });
});

// Read (Get all notices)
router.route("/").get((req, res) => {
    Notice.find().sort({ createdAt: -1 }) // Newest first
        .then((notices) => {
            res.json(notices);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error fetching notices" });
        });
});

// Update (Edit notice)
router.route("/:id").put(async (req, res) => {
    let noticeId = req.params.id;
    const { title, category, content, targetAudience, publishDate, publishTime, isPinned, status, author } = req.body;

    const updateNotice = {
        title,
        category,
        content,
        targetAudience,
        publishDate,
        publishTime,
        isPinned,
        status,
        author
    };

    await Notice.findByIdAndUpdate(noticeId, updateNotice)
        .then(() => {
            res.status(200).send({ status: "Notice updated" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "Error updating notice", error: err.message });
        });
});

// Delete (Remove notice)
router.route("/:id").delete(async (req, res) => {
    let noticeId = req.params.id;

    await Notice.findByIdAndDelete(noticeId)
        .then(() => {
            res.status(200).send({ status: "Notice deleted" });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error deleting notice", error: err.message });
        });
});

// Read One (Get single notice)
router.route("/:id").get(async (req, res) => {
    let noticeId = req.params.id;
    await Notice.findById(noticeId)
        .then((notice) => {
            res.status(200).send({ status: "Notice fetched", notice });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error fetching notice", error: err.message });
        });
});

module.exports = router;
