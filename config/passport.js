const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;
const bcrypt = require('bcrypt');

// TODO: passport.use();

function validPassword(password, hash){
    bcrypt.compare(password, hash, function(err,result){
      if(err){
        console.log('error while checking password');
      }
      return result;
    });
}


//doc link - http://www.passportjs.org/docs/username-password/

//custom field
const customField = {
    usernameField: 'uname',
    passwordField: 'pw'
};

const verifyCallback = (username, password, done) => {
    User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        
        if (!user) {
          console.log('user not found');
          return done(null, false, { message: 'Incorrect username.' });
        }

        const isValid = validPassword(password,user.hash);
        console.log('valid',isvalid);

        if (!isValid) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

//serialize
passport.serializeUser((user, done) => {
    return done(null, user);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            return done(null, user);
        })
        .catch(err => done(err));
});
