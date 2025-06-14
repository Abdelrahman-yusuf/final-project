"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const imageProcessor_1 = require("../utils/imageProcessor");
const router = express_1.default.Router();
exports.imageRoutes = router;
/**
 * GET /api/images - Get list of available images
 */
router.get('/', async (req, res) => {
    try {
        const images = await (0, imageProcessor_1.getAvailableImages)();
        res.status(200).json({
            success: true,
            images,
            count: images.length,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve images',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/process', async (req, res) => {
    try {
        const { filename, width, height } = req.query;
        // Validate filename
        if (!filename || typeof filename !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Missing or invalid filename parameter',
            });
        }
        let parsedWidth;
        let parsedHeight;
        if (width) {
            parsedWidth = parseInt(width);
            if (isNaN(parsedWidth) || parsedWidth <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid width parameter. Must be a positive number.',
                });
            }
        }
        if (height) {
            parsedHeight = parseInt(height);
            if (isNaN(parsedHeight) || parsedHeight <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid height parameter. Must be a positive number.',
                });
            }
        }
        const cachedImage = await (0, imageProcessor_1.getCachedImage)(filename, parsedWidth, parsedHeight);
        if (cachedImage) {
            return res.status(200).json({
                success: true,
                message: 'Image retrieved from cache',
                data: {
                    filename: cachedImage,
                    url: `/processed/${cachedImage}`,
                    cached: true,
                },
            });
        }
        const processedInfo = await (0, imageProcessor_1.processImage)({
            filename,
            width: parsedWidth,
            height: parsedHeight,
        });
        res.status(200).json({
            success: true,
            message: 'Image processed successfully',
            data: {
                ...processedInfo,
                url: `/processed/${processedInfo.filename}`,
                cached: false,
            },
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        let statusCode = 500;
        if (errorMessage.includes('not found')) {
            statusCode = 404;
        }
        else if (errorMessage.includes('Width') || errorMessage.includes('Height') || errorMessage.includes('required')) {
            statusCode = 400;
        }
        res.status(statusCode).json({
            success: false,
            message: 'Image processing failed',
            error: errorMessage,
        });
    }
});
//# sourceMappingURL=imageRoutes.js.map