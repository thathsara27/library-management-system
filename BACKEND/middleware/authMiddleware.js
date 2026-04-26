const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_libraryapp123";

// Verify standard JWT token (Any logged in user)
const verifyToken = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access Denied. No token provided." });

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

// Verify if user is Admin/Librarian
const isAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && (req.user.role === "Librarian" || req.user.role === "admin" || req.user.role === "Admin")) {
            next();
        } else {
            res.status(403).json({ error: "Access Denied. Admins only." });
        }
    });
};

module.exports = { verifyToken, isAdmin };
