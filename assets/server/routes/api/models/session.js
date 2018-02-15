/**
 *
 *
 *
 *
 *
 */

var mongoose = require("mongoose");


var SessionSchema = new mongoose.Schema({
    token: String,
    userId: String,
    userEmail: String,
    created_at: { type: Date, default: Date.now }
});

var Session = mongoose.model("Session", SessionSchema);


module.exports = {
    schema: SessionSchema,
    model: Session
};