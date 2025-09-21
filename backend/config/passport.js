const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/github/callback',
      },
     async (accessToken, refreshToken, profile, done) => {
        const userData = {
          githubId: profile.id,
          username: profile.username,
          avatarUrl: profile.photos[0].value,
          name: profile.displayName || profile.username,
          githubToken: accessToken,
        };

        try {
          let user = await User.findOne({ where: { githubId: profile.id } });
          if (user) {
            user.name = profile.displayName || profile.username; 
            user.githubToken = accessToken;
            await user.save();
            done(null, user);
          } else {
            user = await User.create(userData);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    )
  );
};
