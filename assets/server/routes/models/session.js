/**
 *
 *
 *
 *
 *
 */

var mongoose = require("mongoose");


var SessionSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        indexed: true
    },
    userId: {
        type: String,
        required: true,
        indexed: true
    },
    userEmail: {
        type: String,
        required: true
    }
}, { timestamps: true });

var Session = mongoose.model("Session", SessionSchema);


module.exports = {
    schema: SessionSchema,
    model: Session
};