const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');

/* 
this is an module file (user.js) in this file we are writing models of our projects
like Registration,Login,Profile of user etc,here we are also performing business logic of that
models
**/

/*Register is module in that we are doing registration of user
using name,email,username,password and all that fields are 
store in database
**/
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
//This addUser is method for storing/inserting users detail into database
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to register user' });
        } else {
            res.json({ success: true, msg: 'register user successfully' });
        }
    });
});


/*Authentication is also an module for showing authenticate users details with
their username and passpord.here if user is not registerthey will give not found error.
else they check password,if both are matches they will show all users detail
**/
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    //This getUserByUsername method is for checking authenticated user
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User Not found' });
        }
        //this comparePassword method is for matching users password
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({ data: user }, config.secret, {
                    expiresIn: 604800 //1 week
                    
                });
                //if user and password matches they will show users name,username,email
                res.json({
                    success: true,
                    token: 'JWT' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Wrong Password' });
            }
        });
    });
});


//Profile
router.get('/profile', (req, res, next) => {
    res.send('PROFILE');
});



module.exports = router;