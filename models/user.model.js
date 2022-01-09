const mongoose = require('mongoose');
require('mongoose-type-email');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        minLength: 1
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        unique: true,
        required: true,
        maxLength: 255,
    },
    password: {
        type: String,
        required: true,
    },
    sexe: {
        type: String,
        enum: ["H", "F"],
        required: true,
    },
    role: {
        type: String,
        enum: ["SIMPLE_USER", "SUPER_USER"],
        default: "SIMPLE_USER",
    },
    dateNaissance: {
        type: Date,
        min: '1900-01-01',
        max: '2019-01-01',
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    subscription: {
        type: String,
        enum: [0, "trial", "hasUsingTrial", 1],
        default: 0,
        maxLength: 10
    },
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('User', userSchema);
