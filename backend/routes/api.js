const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const GITHUB_API_URL = 'https://api.github.com';

const getAuthHeaders = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user || !user.githubToken) {
    throw new Error('User or token not found');
  }
  return {
    headers: { Authorization: `token ${user.githubToken}` },
  };
};

// @route   GET /api/repos
// @desc    Get logged-in user's public repositories
// @access  Private
router.get('/repos', authMiddleware, async (req, res) => {
  try {
    const config = await getAuthHeaders(req.user.id);
    const response = await axios.get(`${GITHUB_API_URL}/user/repos?type=public&sort=updated`, config);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/user/me
// @desc    Get the logged-in user's data
// @access  Private
router.get('/user/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['githubToken'] },
    });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/repos/:owner/:repo/stats
// @desc    Get commit and language stats for a specific repository
// @access  Private
router.get('/repos/:owner/:repo/stats', authMiddleware, async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const config = await getAuthHeaders(req.user.id);

        const [commitActivity, languages, contributors] = await Promise.all([
            axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/stats/commit_activity`, config),
            axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/languages`, config),
            axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/stats/contributors`, config),
        ]);

        const totalCommits = (contributors.data && Array.isArray(contributors.data))
            ? contributors.data.reduce((acc, contributor) => acc + contributor.total, 0)
            : 0;

        res.json({
            commitActivity: commitActivity.data,
            languages: languages.data,
            totalCommits: totalCommits,
        });
    } catch (err) {
        if (err.response && err.response.status === 202) {
            return res.json({ commitActivity: [], languages: {}, totalCommits: 0 });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/user/action-items
// @desc    Get PRs and issues assigned to the user
// @access  Private
router.get('/user/action-items', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const config = await getAuthHeaders(req.user.id);
    const username = user.username;

    const prQuery = `is:open is:pr assignee:${username}`;
    const issueQuery = `is:open is:issue assignee:${username}`;

    const [prResponse, issueResponse] = await Promise.all([
      axios.get(`${GITHUB_API_URL}/search/issues?q=${encodeURIComponent(prQuery)}`, config),
      axios.get(`${GITHUB_API_URL}/search/issues?q=${encodeURIComponent(issueQuery)}`, config)
    ]);

    res.json({
      pullRequests: prResponse.data.items,
      issues: issueResponse.data.items,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;