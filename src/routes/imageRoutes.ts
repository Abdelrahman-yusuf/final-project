import express from 'express';
import { processImage, getCachedImage, getAvailableImages } from '../utils/imageProcessor';

const router = express.Router();

/**
 * GET /api/images - Get list of available images
 */
router.get('/', async (req, res) => {
  try {
    const images = await getAvailableImages();
    res.status(200).json({
      success: true,
      images,
      count: images.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve images',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/images/process - Process an image with optional resizing
 * Query parameters:
 * - filename (required): Name of the image file
 * - width (optional): Desired width in pixels
 * - height (optional): Desired height in pixels
 */
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

    // Parse and validate dimensions
    let parsedWidth: number | undefined;
    let parsedHeight: number | undefined;

    if (width) {
      parsedWidth = parseInt(width as string);
      if (isNaN(parsedWidth) || parsedWidth <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid width parameter. Must be a positive number.',
        });
      }
    }

    if (height) {
      parsedHeight = parseInt(height as string);
      if (isNaN(parsedHeight) || parsedHeight <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid height parameter. Must be a positive number.',
        });
      }
    }

    // Check for cached image first
    const cachedImage = await getCachedImage(filename, parsedWidth, parsedHeight);
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

    // Process the image
    const processedInfo = await processImage({
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Determine appropriate status code based on error type
    let statusCode = 500;
    if (errorMessage.includes('not found')) {
      statusCode = 404;
    } else if (errorMessage.includes('Width') || errorMessage.includes('Height') || errorMessage.includes('required')) {
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      message: 'Image processing failed',
      error: errorMessage,
    });
  }
});

export { router as imageRoutes };