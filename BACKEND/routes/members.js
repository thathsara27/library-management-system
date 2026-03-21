const router = require("express").Router();
let Member = require("../models/Member");

// Get all members
router.route("/").get((req, res) => {
    Member.find()
        .then((members) => {
            res.json(members);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error fetching members" });
        });
});

// Add a member
router.route("/").post((req, res) => {
    const { name, class: className, admissionNumber, address, phone } = req.body;

    const newMember = new Member({
        name,
        class: className,
        admissionNumber,
        address,
        phone
    });

    newMember.save()
        .then(() => {
            res.json("Member Added");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Error adding member", details: err.message });
        });
});

// Update a member
router.route("/:id").put(async (req, res) => {
    let userId = req.params.id;
    const { name, class: className, admissionNumber, address, phone } = req.body;

    const updateMember = {
        name,
        class: className,
        admissionNumber,
        address,
        phone
    };

    await Member.findByIdAndUpdate(userId, updateMember)
        .then(() => {
            res.status(200).send({ status: "User updated" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "Error with updating data", error: err.message });
        });
});

// Delete a member
router.route("/:id").delete(async (req, res) => {
    let userId = req.params.id;

    await Member.findByIdAndDelete(userId)
        .then(() => {
            res.status(200).send({ status: "User deleted" });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error with delete user", error: err.message });
        });
});

// Get one member
router.route("/:id").get(async (req, res) => {
    let userId = req.params.id;
    const user = await Member.findById(userId)
        .then((member) => {
            res.status(200).send({ status: "User fetched", member });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error with get user", error: err.message });
        });
});

module.exports = router;
