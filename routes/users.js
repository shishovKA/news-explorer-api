const router = require('express').Router();

const {
  getMe,
} = require('../controllers/users.js');

router.get('/me', getMe);

module.exports = router;
