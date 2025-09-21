const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// @desc    Auth with GitHub
// @route   GET /auth/github
router.get('/github', passport.authenticate('github', { scope: ['read:user', 'repo'] }));

// @desc    GitHub auth callback
// @route   GET /auth/github/callback
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    const payload = { id: req.user.id, username: req.user.username };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  }
);

module.exports = router;
