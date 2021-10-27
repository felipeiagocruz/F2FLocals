const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js')
const usersControllers = require('../controllers/users.js')
const passport = require('passport');

router.route('/register')
    .get(usersControllers.renderRegistro)
    .post(catchAsync(usersControllers.registrarUser))

router.route('/login')
    .get(usersControllers.loginUser)
    //Middleware esquisito do passport, ficar atento.
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersControllers.passportLogin)

router.get('/logout', usersControllers.logoutUser)

module.exports = router;