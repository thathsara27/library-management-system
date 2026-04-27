const router = require("express").Router();
const Setting = require("../models/Setting");

// Get settings (creates default if none exists)
router.route("/").get(async (req, res) => {
    try {
        let setting = await Setting.findOne();
        if (!setting) {
            // Create default settings if not exists
            setting = new Setting({});
            await setting.save();
        }
        res.status(200).json(setting);
    } catch (err) {
        console.error("Error fetching settings:", err);
        res.status(500).json({ error: "Error fetching settings", details: err.message });
    }
});

// Update settings
router.route("/").put(async (req, res) => {
    try {
        let setting = await Setting.findOne();
        
        if (!setting) {
            // Should exist from GET, but just in case
            setting = new Setting(req.body);
            await setting.save();
        } else {
            // Update the existing document
            setting = await Setting.findByIdAndUpdate(setting._id, req.body, { new: true });
        }
        
        res.status(200).json({ status: "Settings updated", setting });
    } catch (err) {
        console.error("Error updating settings:", err);
        res.status(500).json({ error: "Error updating settings", details: err.message });
    }
});

module.exports = router;
