const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function (app) {
    // app.get('/', function (req, res, next) {
    //     res.send(['Water','data','School']);
    // });
    app.get('/', requireAuth, function (req, res) {
        //console.log('Usersssssssssssssssssssss: ', req.user.email);
        //res.json({ hi: 'there', email: req.user.email, user_id: req.user['_id'] });
        res.send({ message: 'Super secret code is ABC123' });
    });

    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
}