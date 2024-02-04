const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const passport = require('passport'); 
const { database } = require('./keys');

// Initializations
const app = express();
require('./lib/passport');

// Settings
app.set('port',process.env.port || 4000);
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine','.hbs');


// MiddleWare
app.use(session({
    secret: 'PabloPayMysqlNodeSession',
    resave: false,
    saveUninitialized: false,
    store: new MySqlStore(database)    
}));

app.use(flash());

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req,res,next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    app.locals.proyectoT = req.proyectoT;
    
    next();
} )


// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use( '/proyectos', require('./routes/proyectos'));

// Publics
app.use(express.static(path.join(__dirname,'public')));


// Starting the Server
app.listen(app.get('port'), () => { console.log('Server on Port:', app.get('port')) } )