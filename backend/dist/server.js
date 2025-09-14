"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import helmet from 'helmet'; // Temporarily disabled for CORS debugging
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const game_1 = __importDefault(require("./routes/game"));
const icons_1 = __importDefault(require("./routes/icons"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
// CORS configuration - Allow all origins
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
// Raw body capture middleware for text/plain requests
app.use('/api/game/complete', (req, res, next) => {
    if (req.headers['content-type']?.includes('text/plain')) {
        let rawBody = '';
        req.on('data', chunk => rawBody += chunk);
        req.on('end', () => {
            req.rawBody = rawBody;
            next();
        });
    }
    else {
        next();
    }
});
// Body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('combined'));
app.get('/api/health', (req, res) => {
    res.json({ message: 'The Search Game API is running!' });
});
app.use('/api/auth', auth_1.default);
app.use('/api/game', game_1.default);
app.use('/api/icons', icons_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});
