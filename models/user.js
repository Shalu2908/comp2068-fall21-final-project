// link to mongoose
const mongoose = require('mongoose')
const plm =require('passport-local-mongoose') // need this module so this model can be used for auth


// schema definition for users
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    oauthProvider: String,
    oauthId: String

})
// use passport-local-mongoose to extend this model's functionality so it can be include User Management & Authentication
userSchema.plugin(plm)

// make the model public
module.exports = mongoose.model('User', userSchema)