const router = require("express").Router();
const Staff = require("../models/Staff");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

// JWT Secret Key (Should normally be in .env)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_libraryapp123";

// Register (Create Staff Account)
router.post("/register", async (req, res) => {
    try {
        const { fullName, staffId, department, email, password, adminSecret } = req.body;

        // Verify the Admin Secret
        const REQUIRED_SECRET = process.env.ADMIN_REGISTRATION_SECRET || "LibraryAdmin2024";
        if (adminSecret !== REQUIRED_SECRET) {
            return res.status(403).json({ error: "Invalid Administrator Secret Key. Unauthorized to register as staff." });
        }

        // Check if user already exists
        const existingStaff = await Staff.findOne({ $or: [{ email }, { staffId }] });
        if (existingStaff) {
            return res.status(400).json({ error: "Staff with that email or ID already exists." });
        }

        const newStaff = new Staff({
            fullName,
            staffId,
            department,
            email,
            password
        });

        await newStaff.save();
        
        // Generate token immediately so they can log straight in (optional)
        const token = jwt.sign({ id: newStaff._id, role: newStaff.role }, JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({
            message: "Account created successfully",
            token,
            user: { _id: newStaff._id, fullName: newStaff.fullName, email: newStaff.email, staffId: newStaff.staffId, role: newStaff.role }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during registration", details: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const staff = await Staff.findOne({ email });
        if (!staff) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        // Check password
        const isMatch = await staff.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        // Generate Token
        const token = jwt.sign({ id: staff._id, role: staff.role }, JWT_SECRET, { expiresIn: "30d" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { _id: staff._id, fullName: staff.fullName, email: staff.email, staffId: staff.staffId, role: staff.role }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during login" });
    }
});

// Change Password
router.post("/change-password", async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        const staff = await Staff.findOne({ email });
        if (!staff) return res.status(404).json({ error: "User not found" });

        const isMatch = await staff.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ error: "Incorrect current password." });

        staff.password = newPassword;
        await staff.save(); // pre-save hook automatically bcrypts the new password

        res.status(200).json({ message: "Password updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during password change" });
    }
});

// ------------- STUDENT AUTH ------------- //

// Student Register
router.post("/student/register", async (req, res) => {
    try {
        const { name, class: className, admissionNumber, address, phone, email, password } = req.body;

        const existingStudent = await Student.findOne({ $or: [{ email }, { admissionNumber }] });
        if (existingStudent) {
            return res.status(400).json({ error: "Student with that email or Admission Number already exists." });
        }

        const newStudent = new Student({
            name,
            class: className,
            admissionNumber,
            address,
            phone,
            email,
            password,
            role: "Student"
        });

        await newStudent.save();
        
        const token = jwt.sign({ id: newStudent._id, role: newStudent.role }, JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({
            message: "Student account created successfully",
            token,
            user: { _id: newStudent._id, name: newStudent.name, email: newStudent.email, admissionNumber: newStudent.admissionNumber, role: newStudent.role }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during registration", details: err.message });
    }
});

// Student Login
router.post("/student/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const isMatch = await student.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ id: student._id, role: student.role }, JWT_SECRET, { expiresIn: "30d" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { _id: student._id, name: student.name, email: student.email, admissionNumber: student.admissionNumber, role: student.role }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during login" });
    }
});

module.exports = router;
