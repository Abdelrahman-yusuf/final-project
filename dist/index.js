"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const imageRoutes_1 = require("./routes/imageRoutes");
const uploadRoutes_1 = require("./routes/uploadRoutes");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../images')));
app.use('/processed', express_1.default.static(path_1.default.join(__dirname, '../processed')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend')));
// Routes
app.use('/api/images', imageRoutes_1.imageRoutes);
app.use('/api/upload', uploadRoutes_1.uploadRoutes);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});
// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map