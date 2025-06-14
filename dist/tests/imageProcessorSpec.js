"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageProcessor_1 = require("../utils/imageProcessor");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
describe('Image Processing Module', () => {
    const testImagePath = path_1.default.join(__dirname, '../../images');
    const processedImagePath = path_1.default.join(__dirname, '../../processed');
    beforeAll(async () => {
        // Create test directories
        try {
            await promises_1.default.mkdir(testImagePath, { recursive: true });
            await promises_1.default.mkdir(processedImagePath, { recursive: true });
        }
        catch {
            // Directories may already exist
        }
    });
    describe('processImage function', () => {
        it('should throw error when filename is not provided', async () => {
            try {
                await (0, imageProcessor_1.processImage)({ filename: '' });
                fail('Expected error to be thrown');
            }
            catch (error) {
                expect(error instanceof Error).toBe(true);
                expect(error.message).toContain('Filename is required');
            }
        });
        it('should throw error when width is invalid', async () => {
            try {
                await (0, imageProcessor_1.processImage)({ filename: 'test.jpg', width: -1 });
                fail('Expected error to be thrown');
            }
            catch (error) {
                expect(error instanceof Error).toBe(true);
                expect(error.message).toContain('Width must be between');
            }
        });
        it('should throw error when height is invalid', async () => {
            try {
                await (0, imageProcessor_1.processImage)({ filename: 'test.jpg', height: 0 });
                fail('Expected error to be thrown');
            }
            catch (error) {
                expect(error instanceof Error).toBe(true);
                expect(error.message).toContain('Height must be between');
            }
        });
        it('should throw error when image file does not exist', async () => {
            try {
                await (0, imageProcessor_1.processImage)({ filename: 'nonexistent.jpg' });
                fail('Expected error to be thrown');
            }
            catch (error) {
                expect(error instanceof Error).toBe(true);
                expect(error.message).toContain('not found');
            }
        });
    });
    describe('getCachedImage function', () => {
        it('should return null when no cached image exists', async () => {
            const result = await (0, imageProcessor_1.getCachedImage)('nonexistent.jpg', 100, 100);
            expect(result).toBeNull();
        });
        it('should handle empty filename', async () => {
            const result = await (0, imageProcessor_1.getCachedImage)('', 100, 100);
            expect(result).toBeNull();
        });
    });
    describe('getAvailableImages function', () => {
        it('should return an array', async () => {
            const result = await (0, imageProcessor_1.getAvailableImages)();
            expect(Array.isArray(result)).toBe(true);
        });
        it('should handle missing images directory gracefully', async () => {
            // This test ensures the function doesn't crash when directory doesn't exist
            const result = await (0, imageProcessor_1.getAvailableImages)();
            expect(Array.isArray(result)).toBe(true);
        });
    });
});
//# sourceMappingURL=imageProcessorSpec.js.map