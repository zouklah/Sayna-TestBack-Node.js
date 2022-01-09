const mongoose = require('mongoose');
const { Schema } = mongoose;

const songSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true
    },
    cover: {
        type: Boolean,
        enum: [false, true],
        required: true
    },
    time: {
        type: Number, // Exprimer en secondes
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    createdAt: {
    	type: Date,
    	default: Date.now
    },
    updatedAt: {
    	type: Date,
    	default: Date.now
    }
})

songSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Song', songSchema);