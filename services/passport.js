const passport = require('passport');
const config = require('../config');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
    // Verify this username and passport, 
    // call done with the user if it is the correct email and password
    // otherwise, call done with false
    User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err, false); }
        if (!user) { return done(null, false); }
        // compar passwords is 'password' equal to user.password
        user.comparePassword(password, function (err, isMatch) {
            if (err) { return done(err, false); }
            if (isMatch) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    });
});

//-----------------------------------------------------------------------------------------

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    //done({}, true);
    User.findById(payload.sub, function (err, user) {
        if (err) { return done(err, false); }
        if (user) {
            //console.log('Usersssssssssssssssssssss: ',user);
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

// Tell passport use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);