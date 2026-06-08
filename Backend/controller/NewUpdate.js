const NewUpdate = require('../models/NewUpdate');
const cloudinary = require('../config/cloudinary');

// ── Helper: upload buffer to Cloudinary ──────────────────────────
const uploadToCloudinary = (buffer, options) =>
    new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(options, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            })
            .end(buffer);
    });

// ── CREATE ───────────────────────────────────────────────────────
// POST /api/newupdate/create
// multipart: title (required), description (required), image (required), points (optional JSON array or comma-separated string)
exports.createNewUpdate = async (req, res) => {
    try {
        const { title, description, points, subTitle } = req.body;

        // Cover image is required
        if (!req.files?.image?.[0]) {
            return res.status(400).json({
                success: false,
                message: 'Cover image is required',
            });
        }

        // Parse points — accept JSON array string OR comma-separated string
        let parsedPoints = [];
        if (points) {
            try {
                parsedPoints = JSON.parse(points); // e.g. '["HD quality","Fast processing"]'
            } catch {
                // Fallback: split by comma
                parsedPoints = points
                    .split(',')
                    .map((p) => p.trim())
                    .filter(Boolean);
            }
        }

        // Upload cover image to Cloudinary
        const imageResult = await uploadToCloudinary(req.files.image[0].buffer, {
            folder: 'newupdates/images',
        });

        const newUpdate = await NewUpdate.create({
            title,
            subTitle,
            description,
            image: imageResult.secure_url,
            points: parsedPoints,
        });

        res.status(201).json({
            success: true,
            message: 'NewUpdate created successfully',
            data: newUpdate,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── GET ALL ──────────────────────────────────────────────────────
// GET /api/newupdate/all
exports.getAllNewUpdates = async (req, res) => {
    try {
        const newUpdates = await NewUpdate.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: newUpdates.length,
            data: newUpdates,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── GET SINGLE ───────────────────────────────────────────────────
// GET /api/newupdate/:id
exports.getNewUpdateById = async (req, res) => {
    try {
        const newUpdate = await NewUpdate.findById(req.params.id);

        if (!newUpdate) {
            return res.status(404).json({
                success: false,
                message: 'NewUpdate not found',
            });
        }

        res.status(200).json({ success: true, data: newUpdate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── GET BY SUBTITLE ──────────────────────────────────────────────
// GET /api/newupdate/subtitle/:subTitle
// Supports case-insensitive exact match
// e.g. /api/newupdate/subtitle/Smart%20Healthcare%20Equipment
exports.getBySubTitle = async (req, res) => {
    try {
        const { subTitle } = req.params;

        if (!subTitle?.trim()) {
            return res.status(400).json({ success: false, message: 'subTitle param is required' });
        }

        const newUpdate = await NewUpdate.findOne({
            subTitle: { $regex: new RegExp(`^${subTitle.trim()}$`, 'i') },
        });

        if (!newUpdate) {
            return res.status(404).json({
                success: false,
                message: `No update found with subTitle: "${subTitle}"`,
            });
        }

        res.status(200).json({ success: true, data: newUpdate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── UPDATE ───────────────────────────────────────────────────────
// PUT /api/newupdate/:id
// multipart: title?, description?, image? (optional), points? (optional)
exports.updateNewUpdate = async (req, res) => {
    try {
        const newUpdate = await NewUpdate.findById(req.params.id);

        if (!newUpdate) {
            return res.status(404).json({
                success: false,
                message: 'NewUpdate not found',
            });
        }

        const updateData = {
            title: req.body.title || newUpdate.title,
            subTitle: req.body.subTitle || newUpdate.subTitle,
            description: req.body.description || newUpdate.description,
            points: newUpdate.points, // keep existing by default
        };

        // Update points if provided
        if (req.body.points !== undefined) {
            try {
                updateData.points = JSON.parse(req.body.points);
            } catch {
                updateData.points = req.body.points
                    .split(',')
                    .map((p) => p.trim())
                    .filter(Boolean);
            }
        }

        // New image uploaded → replace
        if (req.files?.image?.[0]) {
            const imageResult = await uploadToCloudinary(req.files.image[0].buffer, {
                folder: 'newupdates/images',
            });
            updateData.image = imageResult.secure_url;
        }

        const updated = await NewUpdate.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true },
        );

        res.status(200).json({
            success: true,
            message: 'NewUpdate updated successfully',
            data: updated,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── DELETE ───────────────────────────────────────────────────────
// DELETE /api/newupdate/:id
exports.deleteNewUpdate = async (req, res) => {
    try {
        const newUpdate = await NewUpdate.findById(req.params.id);

        if (!newUpdate) {
            return res.status(404).json({
                success: false,
                message: 'NewUpdate not found',
            });
        }

        await NewUpdate.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'NewUpdate deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};