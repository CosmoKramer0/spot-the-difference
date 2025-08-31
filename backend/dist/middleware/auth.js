"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = require("../utils/auth");
const authMiddleware = (req, res, next) => {
    const token = req.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = (0, auth_1.verifyToken)(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
};
exports.authMiddleware = authMiddleware;
