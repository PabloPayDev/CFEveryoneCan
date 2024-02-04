const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');

//----- Registrarse -----

router.get('/signup',isNotLoggedIn,(req,res) => {
    res.render('auth/signup');
});

/*
// Alternativa para un SingUp

router.post('/signup',(req,res) => {
    
    passport.authenticate('local.singup' , { 
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    });
    
    console.log(req.body);
    res.send('received');
});
*/

router.post( '/signup', isNotLoggedIn , passport.authenticate('local.signup' , {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
    
}));

// ----- Ingresar -----

router.get( '/signin' , isNotLoggedIn , (req,res) => {
    res.render('auth/signin');
});
/*
router.post( '/signin', (req,res,next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    });
});*/

router.post( '/signin' , isNotLoggedIn , passport.authenticate('local.signin' , {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
    
}));

// ----- Perfil -----

router.get('/profile', isLoggedIn ,(req,res) => {
    
    res.render('profile');
});

router.get('/logout', isLoggedIn , (req,res) =>{
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;