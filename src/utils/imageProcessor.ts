import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export interface ImageProcessingOptions {
  filename: string;
  width?: number;
  height?: number;
}

export interface ProcessedImageInfo {
  filename: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

/**
 * Process an image with Sharp - resize and convert to JPEG
 * @param options - Image processing options
 * @returns Promise<ProcessedImageInfo> - Information about processed image
 */
export const processImage = async (
  options: ImageProcessingOptions
): Promise<ProcessedImageInfo> => {
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

  const inputPath = path.join(__dirname, '../../images', filename);
  const outputDir = path.join(__dirname, '../../processed');
  
  // Create processed directory if it doesn't exist
  try {
    await fs.access(outputDir);
  } catch {
    await fs.mkdir(outputDir, { recursive: true });
  }

  // Generate output filename
  const nameWithoutExt = path.parse(filename).name;
  const outputFilename = `${nameWithoutExt}_${width || 'auto'}x${height || 'auto'}.jpg`;
  const outputPath = path.join(outputDir, outputFilename);

  try {
    // Check if input file exists
    await fs.access(inputPath);

    // Process image with Sharp
    let sharpInstance = sharp(inputPath);

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
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        throw new Error(`Image file '${filename}' not found`);
      }
      throw new Error(`Image processing failed: ${error.message}`);
    }
    throw new Error('Unknown error occurred during image processing');
  }
};

/**
 * Check if processed image already exists (for caching)
 * @param filename - Original filename
 * @param width - Desired width
 * @param height - Desired height
 * @returns Promise<string | null> - Path to cached image or null
 */
export const getCachedImage = async (
  filename: string,
  width?: number,
  height?: number
): Promise<string | null> => {
  const nameWithoutExt = path.parse(filename).name;
  const cachedFilename = `${nameWithoutExt}_${width || 'auto'}x${height || 'auto'}.jpg`;
  const cachedPath = path.join(__dirname, '../../processed', cachedFilename);

  try {
    await fs.access(cachedPath);
    return cachedFilename;
  } catch {
    return null;
  }
};

/**
 * Get list of available images
 * @returns Promise<string[]> - Array of image filenames
 */
export const getAvailableImages = async (): Promise<string[]> => {
  const imagesDir = path.join(__dirname, '../../images');
  
  try {
    const files = await fs.readdir(imagesDir);
    return files.filter(file => 
      /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(file)
    );
  } catch {
    return [];
  }
};