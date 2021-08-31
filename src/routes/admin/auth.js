const express = require('express');
const crypto = require('crypto');
const { signup, signin, signout, forgotPassword, changePassword } = require('../../controller/admin/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth');
const { requireSignin } = require('../../common-middleware');
const router = express.Router();


router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/admin/signout', signout);
router.post('/admin/reset-password', forgotPassword); //request send password to email
router.post('/admin/forgot-password', changePassword); // respon to update password to data
router.post('/admin/profile');
   

module.exports = router;