const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers')

passport.use('local.signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pass',
        passReqToCallback: true
}, async ( req , email , pass , done) => {
        console.log(req.body);
        const rows = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        if( rows.length > 0 )
        {
            const user = rows[0];/*
            const validPass = await helpers.matchPassword( pass , user.pass);
            //
            console.log(user);
            pass = await helpers.encryptPassword(pass);*/
            console.log(pass);
            console.log(user.pass);

            if( pass == user.pass)
            {
                console.log('Todo Correcto');
                done(null, user , req.flash( 'successs' , 'Welcome ' + user.nombre));
            }
            else
            {
                console.log('Password Incorrecto');
                done(null, false, req.flash('message','Incorrect Password'));
            }
        }
        else
        {
            console.log('Usuario Incorrecto');
            return done(null,false,req.flash('message','El nombre de Usuario no Existe'));
        }
        /*
        console.log(req.body);
        console.log(email);
        console.log(pass);
        */
}));

passport.use('local.signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pass',
        passReqToCallback: true
}, async ( req , email , pass , done) => {

        const { nombre } = req.body;
        /*
        const { email } = req.body;
        const { pass } = req.body;
        */
        const newUser = {
                nombre,
                email,
                pass
        };

        //newUser.pass = await helpers.encryptPassword(pass);

        const result = await pool.query('INSERT INTO user SET ?', [newUser]);
        newUser.user_id = result.insertId;

        console.log( result ); 
        console.log( newUser );

        return done(null, newUser);
}));

passport.serializeUser((user,done)=>{
    done(null, user.user_id);
});

passport.deserializeUser(async(id,done)=>{
    const rows = await pool.query('SELECT * FROM user WHERE user_id = ?', [id]);
    done(null, rows[0]);

});
