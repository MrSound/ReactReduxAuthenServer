const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: "You must provide email and password." });
    }

    // See if a user with the given email exists
    User.findOne({ email: email }, function (err, existingUser) {
        if (err) { return next(err); }
        // If a user with email does exist, return error
        if (existingUser) {
            return res.status(422).json({ error: 'Email is in use' });
        }
        // If a user with email does NOT exist, create and save user record
        const user = new User({
            email: email,
            password: password
        });
        user.save(function (err) {
            if (err) { return next(err); }
            // Response to request indicating the user was created
            return res.json({ token: tokenForUser(user) });
        });
    });
}

exports.signin = function (req, res, next) {
    res.json({ token: tokenForUser(req.user) });
}