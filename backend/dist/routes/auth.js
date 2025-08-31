"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../utils/auth");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!name || !phone) {
            return res.status(400).json({
                message: 'Name and phone number are required'
            });
        }
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
            return res.status(400).json({
                message: 'Please provide a valid phone number'
            });
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { phone }
        });
        if (existingUser) {
            const token = (0, auth_1.generateToken)(existingUser.id);
            return res.json({
                message: 'Welcome back!',
                user: {
                    id: existingUser.id,
                    name: existingUser.name,
                    phone: existingUser.phone
                },
                token
            });
        }
        const user = await prisma_1.default.user.create({
            data: {
                name: name.trim(),
                phone: phone.trim()
            }
        });
        const token = (0, auth_1.generateToken)(user.id);
        res.status(201).json({
            message: 'Registration successful!',
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone
            },
            token
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});
router.get('/me', async (req, res) => {
    const token = req.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = JSON.parse(global.Buffer.from(token.split('.')[1], 'base64').toString());
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, phone: true, createdAt: true }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
exports.default = router;
