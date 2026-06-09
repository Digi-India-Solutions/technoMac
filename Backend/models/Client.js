const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true       // Allows hiding a client without deleting
        },
        order: {
            type: Number,       // Controls display order in the frontend
            default: 0
        }
    },
    { timestamps: true }
);

exports.Client = mongoose.model("Client", ClientSchema);