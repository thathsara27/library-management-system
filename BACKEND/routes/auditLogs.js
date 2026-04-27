const router = require("express").Router();
const AuditLog = require("../models/AuditLog");

// Get all audit logs
router.route("/").get(async (req, res) => {
    try {
        let logs = await AuditLog.find().sort({ time: -1 });
        
        // Seed database if empty
        if (logs.length === 0) {
            const mockLogs = [
                { user: "Sarah Connor", role: "Head Librarian", action: "Updated fine rate from $0.25 to $0.50", category: "Fines", time: new Date(Date.now() - 2 * 60000), avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
                { user: "John Doe", role: "System Admin", action: "Enabled Twilio SMS integration", category: "Integrations", time: new Date(Date.now() - 60 * 60000), avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
                { user: "Emily R.", role: "Staff", action: "Modified student loan duration", category: "Policies", time: new Date(Date.now() - 4 * 3600000), avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" },
                { user: "System", role: "Automated", action: "Scheduled backup completed successfully", category: "System", time: new Date(Date.now() - 12 * 3600000), avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Sys" },
            ];
            await AuditLog.insertMany(mockLogs);
            logs = await AuditLog.find().sort({ time: -1 });
        }
        
        res.status(200).json(logs);
    } catch (err) {
        console.error("Error fetching audit logs:", err);
        res.status(500).json({ error: "Error fetching audit logs", details: err.message });
    }
});

// Create a new audit log
router.route("/").post(async (req, res) => {
    try {
        const { user, role, action, category, avatar } = req.body;
        const newLog = new AuditLog({ user, role, action, category, avatar });
        await newLog.save();
        res.status(201).json(newLog);
    } catch (err) {
        console.error("Error creating audit log:", err);
        res.status(500).json({ error: "Error creating audit log", details: err.message });
    }
});

module.exports = router;
