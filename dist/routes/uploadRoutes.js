"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const router = express_1.default.Router();
exports.uploadRoutes = router;
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../images');
        try {
            await promises_1.default.access(uploadDir);
        }
        catch {
            await promises_1.default.mkdir(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Keep original filename with timestamp to avoid conflicts
        const timestamp = Date.now();
        const extension = path_1.default.extname(file.originalname);
        const nameWithoutExt = path_1.default.basename(file.originalname, extension);
        const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${sanitizedName}_${timestamp}${extension}`);
    },
});
// File filter to only allow specific image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|bmp|tiff/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb(new Error('Only image files (JPEG, PNG, GIF, BMP, TIFF) are allowed'));
    }
};
// Configure multer with options
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});
/**
 * POST /api/upload - Upload a new image file
 */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided',
            });
        }
        const fileInfo = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadDate: new Date().toISOString(),
        };
        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: fileInfo,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 10MB.',
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${error.message}`,
        });
    }
    if (error.message.includes('Only image files')) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
    next(error);
});
//# sourceMappingURL=uploadRoutes.js.map