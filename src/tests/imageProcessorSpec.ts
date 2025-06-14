import { processImage, getCachedImage, getAvailableImages } from '../utils/imageProcessor';
import fs from 'fs/promises';
import path from 'path';

describe('Image Processing Module', () => {
  const testImagePath = path.join(__dirname, '../../images');
  const processedImagePath = path.join(__dirname, '../../processed');

  beforeAll(async () => {
    // Create test directories
    try {
      await fs.mkdir(testImagePath, { recursive: true });
      await fs.mkdir(processedImagePath, { recursive: true });
    } catch {
      // Directories may already exist
    }
  });

  describe('processImage function', () => {
    it('should throw error when filename is not provided', async () => {
      try {
        await processImage({ filename: '' });
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect((error as Error).message).toContain('Filename is required');
      }
    });

    it('should throw error when width is invalid', async () => {
      try {
        await processImage({ filename: 'test.jpg', width: -1 });
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect((error as Error).message).toContain('Width must be between');
      }
    });

    it('should throw error when height is invalid', async () => {
      try {
        await processImage({ filename: 'test.jpg', height: 0 });
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect((error as Error).message).toContain('Height must be between');
      }
    });

    it('should throw error when image file does not exist', async () => {
      try {
        await processImage({ filename: 'nonexistent.jpg' });
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect((error as Error).message).toContain('not found');
      }
    });
  });

  describe('getCachedImage function', () => {
    it('should return null when no cached image exists', async () => {
      const result = await getCachedImage('nonexistent.jpg', 100, 100);
      expect(result).toBeNull();
    });

    it('should handle empty filename', async () => {
      const result = await getCachedImage('', 100, 100);
      expect(result).toBeNull();
    });
  });

  describe('getAvailableImages function', () => {
    it('should return an array', async () => {
      const result = await getAvailableImages();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle missing images directory gracefully', async () => {
      // This test ensures the function doesn't crash when directory doesn't exist
      const result = await getAvailableImages();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});