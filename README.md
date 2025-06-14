# Image Processing Web App

A comprehensive web application for image processing with resizing, uploading, and caching capabilities. Built with Node.js, Express, TypeScript, and Sharp for high-performance image manipulation.

## Features

- **Image Upload**: Upload JPG, PNG, GIF, BMP, and TIFF images up to 10MB
- **Image Processing**: Resize images with Sharp library
- **Caching System**: Automatically cache processed images to improve performance
- **Interactive Gallery**: Browse uploaded images with thumbnail previews
- **RESTful API**: Well-documented endpoints for programmatic access
- **Modern Frontend**: Responsive web interface with real-time feedback
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **TypeScript**: Full TypeScript implementation for better code quality

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Development](#development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd image-processing-web-app
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Quick Start

1. Start the development server:
```bash
npm run dev
```

2. Or start the production server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

The application will be running with:
- Frontend accessible at the root URL
- API endpoints available at `/api`
- Image files served from `/images` and `/processed`

## API Documentation

### Base URL
All API endpoints are prefixed with `/api`

### Endpoints

#### 1. Health Check
**GET** `/api/health`

Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

#### 2. Get Available Images
**GET** `/api/images`

Retrieve a list of all available images for processing.

**Response:**
```json
{
  "success": true,
  "images": ["image1.jpg", "image2.png"],
  "count": 2
}
```

#### 3. Process Image
**GET** `/api/images/process`

Process and resize an image. The processed image is cached for subsequent requests.

**Query Parameters:**
- `filename` (required): Name of the image file to process
- `width` (optional): Target width in pixels (1-5000)
- `height` (optional): Target height in pixels (1-5000)

**Example Request:**
```
GET /api/images/process?filename=sample.jpg&width=300&height=200
```

**Success Response:**
```json
{
  "success": true,
  "message": "Image processed successfully",
  "data": {
    "filename": "sample_300x200.jpg",
    "width": 300,
    "height": 200,
    "format": "jpeg",
    "size": 15420,
    "url": "/processed/sample_300x200.jpg",
    "cached": false
  }
}
```

**Error Responses:**
- `400`: Invalid parameters (missing filename, invalid dimensions)
- `404`: Image file not found
- `500`: Image processing failed

#### 4. Upload Image
**POST** `/api/upload`

Upload a new image file to the server.

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `image`
- Supported formats: JPG, PNG, GIF, BMP, TIFF
- Maximum file size: 10MB

**Success Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "filename": "uploaded_image_1234567890.jpg",
    "originalName": "my-image.jpg",
    "size": 524288,
    "mimetype": "image/jpeg",
    "uploadDate": "2023-12-07T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: No file provided, invalid file type, or file too large
- `500`: Upload failed

### Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common error scenarios handled:
- Missing filename, height, or width parameters
- Invalid input for filename (non-string)
- Invalid input for height or width (non-numeric, zero, negative)
- Image file does not exist
- Unsupported file types for upload
- File size exceeding limits

## Frontend Features

### Image Gallery
- Displays thumbnail-sized images (150px height) for all available images
- Click any image to select it for processing
- Visual feedback for selected images
- Responsive grid layout

### Image Upload
- Drag-and-drop file selection
- File type validation
- File size validation (10MB limit)
- Real-time upload progress
- Immediate gallery update after successful upload

### Image Processing
- Form to set desired width and height
- Real-time validation of input values
- Display of processed image with metadata
- API URL generation for direct access
- Copy-to-clipboard functionality for API URLs

### User Experience
- Loading states for all operations
- Success/error notifications
- Responsive design for mobile devices
- Error modal for detailed error messages
- Visual feedback for all user interactions

## Testing

The project includes comprehensive test suites using Jasmine and SuperTest.

### Run Tests
```bash
npm test
```

### Test Coverage
- **Image Processing Module Tests**: Tests for the Sharp image processing functionality
- **API Endpoint Tests**: Tests for all REST API endpoints
- **Error Handling Tests**: Tests for various error scenarios

### Test Files
- `src/tests/imageProcessorSpec.ts`: Tests image processing functions
- `src/tests/endpointsSpec.ts`: Tests API endpoints

## Project Structure

```
deci-l4-web-image-placeholder-app/
├── src/                          # Source code (TypeScript)
│   ├── index.ts                 # Main server file
│   ├── routes/                  # Route handlers
│   │   ├── imageRoutes.ts       # Image processing routes
│   │   └── uploadRoutes.ts      # File upload routes
│   ├── utils/                   # Utility modules
│   │   └── imageProcessor.ts    # Sharp image processing logic
│   └── tests/                   # Test files
│       ├── imageProcessorSpec.ts
│       └── endpointsSpec.ts
├── dist/                        # Compiled JavaScript (generated)
├── frontend/                    # Frontend code
│   ├── index.html              # Main HTML file
│   ├── styles.css              # CSS styles
│   └── script.js               # JavaScript functionality
├── images/                      # Uploaded images storage
├── processed/                   # Processed images cache
├── spec/                        # Jasmine configuration
│   └── support/
│       └── jasmine.json
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
└── README.md                   # This file
```

## Dependencies

### Production Dependencies
- **express**: Web framework for Node.js
- **sharp**: High-performance image processing library
- **multer**: Middleware for handling multipart/form-data (file uploads)
- **cors**: Cross-Origin Resource Sharing middleware

### Development Dependencies
- **typescript**: TypeScript compiler
- **@types/***: Type definitions for TypeScript
- **eslint**: Code linting tool
- **prettier**: Code formatting tool
- **jasmine**: Testing framework
- **supertest**: HTTP assertion library for testing
- **nodemon**: Development server with auto-restart

## Development

### Available Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run the production server
- `npm run dev`: Run development server with auto-restart
- `npm test`: Run all tests
- `npm run lint`: Check code for linting errors
- `npm run lint:fix`: Fix linting errors automatically
- `npm run prettier`: Format code with Prettier
- `npm run prettier:check`: Check if code is formatted correctly

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with recommended rules
- **Prettier**: Consistent