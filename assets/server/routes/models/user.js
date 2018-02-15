/**
 *
 *
 *
 *
 *
 */

var mongoose = require("mongoose");


var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    roles: [String],
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: true,
        lowercase: true
    }
}, { timestamps: true });

module.exports = {
    schema: UserSchema,
    model: mongoose.model("User", UserSchema)
};