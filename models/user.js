const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//user schema
//here we are declearing fields of the database i.e coloumn names with their type
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

//here we are exporting above schema with creating one constant variable
const User = module.exports = mongoose.model('User', UserSchema);

//create getUserById function for gettiing users
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

//this addUser function is for converting password into some encrypted format
module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback)
        });
    });
}

//this getUserBYUsername function is for authenticate the user
module.exports.getUserByUsername = function(username, callback) {
    const query = { username: username }
    User.findOne(query, callback);
}

//this comparePassword is used for matching the authenticated user password
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}