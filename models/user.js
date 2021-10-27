const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//Isso adicionará um campo para password e fará toda a mágica desse rolê aqui do passport.
UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', UserSchema);

