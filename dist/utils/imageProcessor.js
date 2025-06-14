"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableImages = exports.getCachedImage = exports.processImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
/**
 * Process an image with Sharp - resize and convert to JPEG
 * @param options - Image processing options
 * @returns Promise<ProcessedImageInfo> - Information about processed image
 */
const processImage = async (options) => {
    const { filename, width, height } = options;
    // Validate inputs
    if (!filename) {
        throw new Error('Filename is required');
    }
    if (width && (width <= 0 || width > 5000)) {
        throw new Error('Width must be between 1 and 5000 pixels');
    }
    if (height && (height <= 0 || height > 5000)) {
        throw new Error('Height must be between 1 and 5000 pixels');
    }
    const inputPath = path_1.default.join(__dirname, '../../images', filename);
    const outputDir = path_1.default.join(__dirname, '../../processed');
    // Create processed directory if it doesn't exist
    try {
        await promises_1.default.access(outputDir);
    }
    catch {
        await promises_1.default.mkdir(outputDir, { recursive: true });
    }
    // Generate output filename
    const nameWithoutExt = path_1.default.parse(filename).name;
    const outputFilename = `${nameWithoutExt}_${width || 'auto'}x${height || 'auto'}.jpg`;
    const outputPath = path_1.default.join(outputDir, outputFilename);
    try {
        // Check if input file exists
        await promises_1.default.access(inputPath);
        // Process image with Sharp
        let sharpInstance = (0, sharp_1.default)(inputPath);
        // Apply resizing if dimensions provided
        if (width || height) {
            sharpInstance = sharpInstance.resize(width, height, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }
        // Convert to JPEG and save
        const info = await sharpInstance
            .jpeg({ quality: 90 })
            .toFile(outputPath);
        return {
            filename: outputFilename,
            width: info.width,
            height: info.height,
            format: info.format,
            size: info.size,
        };
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('ENOENT')) {
                throw new Error(`Image file '${filename}' not found`);
            }
            throw new Error(`Image processing failed: ${error.message}`);
        }
        throw new Error('Unknown error occurred during image processing');
    }
};
exports.processImage = processImage;
/**
 * Check if processed image already exists (for caching)
 * @param filename - Original filename
 * @param width - Desired width
 * @param height - Desired height
 * @returns Promise<string | null> - Path to cached image or null
 */
const getCachedImage = async (filename, width, height) => {
    const nameWithoutExt = path_1.default.parse(filename).name;
    const cachedFilename = `${nameWithoutExt}_${width || 'auto'}x${height || 'auto'}.jpg`;
    const cachedPath = path_1.default.join(__dirname, '../../processed', cachedFilename);
    try {
        await promises_1.default.access(cachedPath);
        return cachedFilename;
    }
    catch {
        return null;
    }
};
exports.getCachedImage = getCachedImage;
/**
 * Get list of available images
 * @returns Promise<string[]> - Array of image filenames
 */
const getAvailableImages = async () => {
    const imagesDir = path_1.default.join(__dirname, '../../images');
    try {
        const files = await promises_1.default.readdir(imagesDir);
        return files.filter(file => /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(file));
    }
    catch {
        return [];
    }
};
exports.getAvailableImages = getAvailableImages;
//# sourceMappingURL=imageProcessor.js.map