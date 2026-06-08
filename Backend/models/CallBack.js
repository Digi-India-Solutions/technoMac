const mongoose = require('mongoose');

const CallBackSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            default: 'IN - India',
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        mobileNumber: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: String,   // stored as "dd-mm-yyyy" string, as entered in the form
            required: true
        },
        time: {
            type: String,   // e.g. "10:00 AM", "02:30 PM"
            required: true
        },
        description: {
            type: String,   // optional
            default: ''
        },
        status: {
            type: String,
            enum: ['pending', 'contacted', 'closed'],
            default: 'pending'              // admin can update status
        }
    },
    { timestamps: true }
);

exports.CallBack = mongoose.model('CallBack', CallBackSchema);
