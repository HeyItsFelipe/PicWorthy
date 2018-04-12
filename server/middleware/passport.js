const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');
const db = require('../../database/database.js');

Promise.promisifyAll(bcrypt);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log('username password', username, password);
    db.fetchUser(username)
      .then((user) => {
        if (user) {
          return bcrypt.compareAsync(password, user.password)
            .then((result) => {
              console.log('line 30 passport.js', result)
              if (result) {
                done(null, user)
              } else {
                done(null, false, {message: 'Password Incorrect'})
              }
            })
            .catch((err) => {
              throw err;
            })
        } else {
          done(null, false, {message: 'Username does not exist'})
        }
      })
  })
);

module.exports = passport;