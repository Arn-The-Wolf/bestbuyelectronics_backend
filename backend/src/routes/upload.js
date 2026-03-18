import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadType = req.path.includes('product') ? 'products' : 'categories';
        cb(null, path.join(__dirname, '../../uploads', uploadType));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(7);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

// File filter - allow images and videos
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
        'video/mp4', 'video/webm', 'video/quicktime'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images (JPEG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit (increased for videos)
    }
});

// Upload product image (admin only)
router.post('/product', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageUrl = `/uploads/products/${req.file.filename}`;
        // Detect type
        const type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

        res.json({
            message: 'File uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename,
            type: type
        });
    } catch (error) {
        console.error('Upload product file error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// Upload multiple product files
router.post('/product/multiple', authenticateToken, requireAdmin, upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const files = req.files.map(file => ({
            url: `/uploads/products/${file.filename}`,
            type: file.mimetype.startsWith('video/') ? 'video' : 'image',
            filename: file.filename
        }));

        res.json({
            message: 'Files uploaded successfully',
            files: files
        });
    } catch (error) {
        console.error('Upload multiple files error:', error);
        res.status(500).json({ error: 'Failed to upload files' });
    }
});

// Upload category image (admin only)
router.post('/category', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageUrl = `/uploads/categories/${req.file.filename}`;
        res.json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Upload category image error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: error.message });
    }

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    next();
});

export default router;
