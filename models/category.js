// imported mongoose here
const mongoose = require('mongoose');

// schema definition

var categoriesSchema = new mongoose.Schema( {
    name: {
        type: String ,
        required: true
    }
})

// created the model to make it available to the app
module.exports = mongoose.model('Category', categoriesSchema);