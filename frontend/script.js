class ImageProcessingApp {
    constructor() {
        this.selectedImage = null;
        this.apiBaseUrl = '/api';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadImageGallery();
    }

    bindEvents() {
        // File upload events
        const imageUpload = document.getElementById('imageUpload');
        const uploadBtn = document.getElementById('uploadBtn');

        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadBtn.disabled = false;
                uploadBtn.textContent = `Upload ${file.name}`;
            } else {
                uploadBtn.disabled = true;
                uploadBtn.textContent = 'Upload Image';
            }
        });

        uploadBtn.addEventListener('click', () => this.uploadImage());

        // Process form events
        const processForm = document.getElementById('processForm');
        processForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processImage();
        });

        // Copy URL button
        const copyUrlBtn = document.getElementById('copyUrlBtn');
        copyUrlBtn.addEventListener('click', () => this.copyApiUrl());

        // Modal events
        const modal = document.getElementById('errorModal');
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    async loadImageGallery() {
        const gallery = document.getElementById('imageGallery');
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/images`);
            const data = await response.json();

            if (data.success && data.images.length > 0) {
                gallery.innerHTML = '';
                data.images.forEach(image => {
                    this.createImageThumbnail(image, gallery);
                });
            } else {
                gallery.innerHTML = '<div class="loading">No images available. Upload some images to get started!</div>';
            }
        } catch (error) {
            console.error('Error loading images:', error);
            gallery.innerHTML = '<div class="loading">Error loading images. Please try again.</div>';
        }
    }

    createImageThumbnail(imageName, container) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <img src="/images/${imageName}" alt="${imageName}" loading="lazy">
            <div class="image-name">${imageName}</div>
        `;

        imageItem.addEventListener('click', () => {
            this.selectImage(imageName, imageItem);
        });

        container.appendChild(imageItem);
    }

    selectImage(imageName, imageElement) {
        // Remove previous selection
        const previousSelected = document.querySelector('.image-item.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        // Select new image
        imageElement.classList.add('selected');
        this.selectedImage = imageName;

        // Update selected image display
        const selectedContainer = document.getElementById('selectedImageContainer');
        selectedContainer.innerHTML = `
            <img src="/images/${imageName}" alt="${imageName}">
            <p><strong>Selected:</strong> ${imageName}</p>
        `;

        // Enable process button
        const processBtn = document.querySelector('#processForm button[type="submit"]');
        processBtn.disabled = false;
    }

    async uploadImage() {
        const fileInput = document.getElementById('imageUpload');
        const file = fileInput.files[0];
        const statusDiv = document.getElementById('uploadStatus');

        if (!file) {
            this.showStatus(statusDiv, 'Please select a file first.', 'error');
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
        if (!allowedTypes.includes(file.type)) {
            this.showStatus(statusDiv, 'Only image files (JPEG, PNG, GIF, BMP, TIFF) are allowed.', 'error');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.showStatus(statusDiv, 'File size must be less than 10MB.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            this.showStatus(statusDiv, 'Uploading...', 'info');

            const response = await fetch(`${this.apiBaseUrl}/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.showStatus(statusDiv, `Image uploaded successfully: ${data.data.filename}`, 'success');
                
                // Reset file input
                fileInput.value = '';
                document.getElementById('uploadBtn').disabled = true;
                document.getElementById('uploadBtn').textContent = 'Upload Image';

                // Reload gallery to show new image
                await this.loadImageGallery();
            } else {
                this.showStatus(statusDiv, `Upload failed: ${data.message}`, 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showStatus(statusDiv, 'Upload failed. Please try again.', 'error');
        }
    }

    async processImage() {
        if (!this.selectedImage) {
            this.showError('Please select an image first.');
            return;
        }

        const width = document.getElementById('width').value;
        const height = document.getElementById('height').value;
        const statusDiv = document.getElementById('processStatus');

        // Build query parameters
        const params = new URLSearchParams({ filename: this.selectedImage });
        if (width) params.append('width', width);
        if (height) params.append('height', height);

        try {
            this.showStatus(statusDiv, 'Processing image...', 'info');

            const response = await fetch(`${this.apiBaseUrl}/images/process?${params}`);
            const data = await response.json();

            if (data.success) {
                this.showStatus(statusDiv, 
                    `Image processed successfully! ${data.data.cached ? '(Retrieved from cache)' : ''}`, 
                    'success'
                );
                this.displayProcessedImage(data.data, params.toString());
            } else {
                this.showStatus(statusDiv, `Processing failed: ${data.error || data.message}`, 'error');
            }
        } catch (error) {
            console.error('Processing error:', error);
            this.showStatus(statusDiv, 'Processing failed. Please try again.', 'error');
        }
    }

    displayProcessedImage(imageData, queryParams) {
        const container = document.getElementById('processedImageContainer');
        const apiUrlContainer = document.getElementById('apiUrlContainer');
        
        container.innerHTML = `
            <img src="${imageData.url}" alt="Processed Image">
            <div class="image-info">
                <h4>Image Information</h4>
                <p><strong>Filename:</strong> ${imageData.filename}</p>
                <p><strong>Dimensions:</strong> ${imageData.width} × ${imageData.height} pixels</p>
                <p><strong>Format:</strong> ${imageData.format.toUpperCase()}</p>
                <p><strong>File Size:</strong> ${this.formatFileSize(imageData.size)}</p>
                <p><strong>Cached:</strong> ${imageData.cached ? 'Yes' : 'No'}</p>
            </div>
        `;

        // Show API URL
        const apiUrl = `${window.location.origin}${this.apiBaseUrl}/images/process?${queryParams}`;
        document.getElementById('apiUrl').value = apiUrl;
        apiUrlContainer.style.display = 'block';
    }

    copyApiUrl() {
        const apiUrlInput = document.getElementById('apiUrl');
        apiUrlInput.select();
        apiUrlInput.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand('copy');
            
            // Visual feedback
            const copyBtn = document.getElementById('copyUrlBtn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = '#48BB78';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
            this.showError('Failed to copy URL to clipboard');
        }
    }

    showStatus(element, message, type) {
        element.textContent = message;
        element.className = `status-message ${type}`;
        element.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }

    showError(message) {
        const modal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        modal.style.display = 'block';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageProcessingApp();
});