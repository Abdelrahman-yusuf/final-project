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
export declare const processImage: (options: ImageProcessingOptions) => Promise<ProcessedImageInfo>;
/**
 * Check if processed image already exists (for caching)
 * @param filename - Original filename
 * @param width - Desired width
 * @param height - Desired height
 * @returns Promise<string | null> - Path to cached image or null
 */
export declare const getCachedImage: (filename: string, width?: number, height?: number) => Promise<string | null>;
/**
 * Get list of available images
 * @returns Promise<string[]> - Array of image filenames
 */
export declare const getAvailableImages: () => Promise<string[]>;
//# sourceMappingURL=imageProcessor.d.ts.map