const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
}); 

exports.Subscriber = mongoose.model("Subscriber", subscriberSchema);
