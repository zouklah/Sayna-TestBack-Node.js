const mongoose = require('mongoose');
const { Schema } = mongoose;

const refreshtokenSchema = new Schema({
    value: {
        type: String,
        required: true,
    },
    createdAt:{
    	type: Date,
    	default: new Date()
    }
})

refreshtokenSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Refreshtoken', refreshtokenSchema);