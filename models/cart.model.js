const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    cartNumber: {
        type: String,
        unique: true,
        required: true,
        minLength: 16, 
        maxLength: 17 
    },
    month: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        required: true
    },
    year: {
        type: Number,
        min: '1980',
        required: true 
    },
    default: {
        type: String,
        required: true,
    },
    userId : {
        type: String,
        required: true
    }
})

cartSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Cart', cartSchema);