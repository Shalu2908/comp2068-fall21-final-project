// created a schema definition object using mapping notaton
const mongoose = require("mongoose");
var patientsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    category:{
        type: String
    },
    status:{
        type: String,
        default: 'Today'
    }
})

// created a new mongoose model using the provided schema object & exported the model

module.exports = mongoose.model('Patient', patientsSchema);
