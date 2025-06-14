import express from 'express';
import cors from 'cors';
import path from 'path';
import { imageRoutes } from './routes/imageRoutes';
import { uploadRoutes } from './routes/uploadRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/processed', express.static(path.join(__dirname, '../processed')));
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/images', imageRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;