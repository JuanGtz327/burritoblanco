const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const dotenv = require('dotenv').config();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

require('./config/passport')

app.set('views',path.join(__dirname,'../frontend/views'));
app.engine('hbs',hbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
}));
app.set('view engine','hbs');

app.use(express.urlencoded({extended:false}));

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) =>{
    res.locals.err_msg=req.flash('err_msg');
    res.locals.suc_msg=req.flash('suc_msg');
    res.locals.user=req.user || null;
    next();
});

app.use('/',require('./routes/router'));
app.use('/admin',require('./routes/adminRouter'));
app.use('/doctor',require('./routes/doctorRouter'));
app.use('/paciente',require('./routes/pacienteRouter'));

app.use('/static',express.static(path.join(__dirname,'../frontend/public')));

app.listen(PORT,()=>{
    process.env.ENVIROMENT=='develop'?console.log('Server en modo desarollo'):console.log('Server en produccion');;
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});