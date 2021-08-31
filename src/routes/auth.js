const express = require('express');
const { signup, signin, home } = require('../controller/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');
const router = express.Router();

router.get('/', home);
router.post('/signup',validateSignupRequest, isRequestValidated, signup);
router.post('/signin',validateSigninRequest, isRequestValidated, signin);


router.post('/profile', (req, res) => {
    res.status(200).json({ user: 'profile' })
});

module.exports = router;