const router = require("express").Router();
let Student = require("../models/Student");

// Get all students
router.route("/").get((req, res) => {
    Student.find()
        .then((students) => {
            res.json(students);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error fetching students" });
        });
});

// Add a student
router.route("/").post((req, res) => {
    const { name, class: className, admissionNumber, address, phone } = req.body;

    const newStudent = new Student({
        name,
        class: className,
        admissionNumber,
        address,
        phone
    });

    newStudent.save()
        .then(() => {
            res.json("Student Added");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Error adding student", details: err.message });
        });
});

// Update a student
router.route("/:id").put(async (req, res) => {
    let userId = req.params.id;
    const { name, class: className, admissionNumber, address, phone } = req.body;

    const updateStudent = {
        name,
        class: className,
        admissionNumber,
        address,
        phone
    };

    await Student.findByIdAndUpdate(userId, updateStudent)
        .then(() => {
            res.status(200).send({ status: "User updated" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "Error with updating data", error: err.message });
        });
});

// Delete a student
router.route("/:id").delete(async (req, res) => {
    let userId = req.params.id;

    await Student.findByIdAndDelete(userId)
        .then(() => {
            res.status(200).send({ status: "User deleted" });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error with delete user", error: err.message });
        });
});

// Get one student
router.route("/:id").get(async (req, res) => {
    let userId = req.params.id;
    const user = await Student.findById(userId)
        .then((student) => {
            res.status(200).send({ status: "User fetched", student });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error with get user", error: err.message });
        });
});

module.exports = router;
