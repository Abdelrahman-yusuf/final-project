const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return 200 status and health check message', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        message: 'Server is running',
      });
    });
  });

  describe('GET /api/images', () => {
    it('should return list of available images', async () => {
      const response = await request(app)
        .get('/api/images')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.images).toBeDefined();
      expect(response.body.count).toBeDefined();
      expect(Array.isArray(response.body.images)).toBe(true);
    });
  });

  describe('GET /api/images/process', () => {
    it('should return 400 when filename is missing', async () => {
      const response = await request(app)
        .get('/api/images/process')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('filename');
    });

    it('should return 400 when width is invalid', async () => {
      const response = await request(app)
        .get('/api/images/process?filename=test.jpg&width=invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('width');
    });

    it('should return 400 when height is invalid', async () => {
      const response = await request(app)
        .get('/api/images/process?filename=test.jpg&height=-1')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('height');
    });

    it('should return 404 when image file does not exist', async () => {
      const response = await request(app)
        .get('/api/images/process?filename=nonexistent.jpg')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('POST /api/upload', () => {
    it('should return 400 when no file is provided', async () => {
      const response = await request(app)
        .post('/api/upload')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No image file provided');
    });

    it('should handle file upload endpoint', async () => {
      const response = await request(app)
        .post('/api/upload');

      expect([400, 500].includes(response.status)).toBe(true);
    });
  });
});