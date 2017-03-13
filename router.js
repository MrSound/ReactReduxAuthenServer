const Authentication = require('./controllers/authentication');

module.exports = function (app) {
    // app.get('/', function (req, res, next) {
    //     res.send(['Water','data','School']);
    // });
    app.post('/signup',Authentication.signup);
}