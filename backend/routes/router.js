const express = require('express');
const passport = require('passport');
const router = express.Router();

const { getDoctorbyEmail } = require('../controllers/doctorController');
const { getPacienteByEmail } = require('../controllers/pacienteController');
const { getAdminbyEmail, getAdmNum, getDocNum, getPacNum } = require('../controllers/adminController');

router.get('/',(req,res)=>{
    getAdmNum(admNum=>{
        getDocNum(docNum=>{
            getPacNum(pacNum=>{
                res.render('index',{admNum,docNum,pacNum});
            })
        })
    })
});

router.get('/login-adm',(req,res)=>{
    res.render('loginadm');
});

router.get('/login',(req,res)=>{
    res.render('login');
});

router.get('/login-pac',(req,res)=>{
    res.render('loginpac');
});

router.post('/login-adm',passport.authenticate('adm-sign',{failureRedirect: '/login-adm'}),(req,res)=>{
    const {Correo} = req.body;
    getAdminbyEmail(Correo,admin=>{
        res.redirect(`/admin/dashboard`)
    });
});

router.post('/login',passport.authenticate('doc-sign',{failureRedirect: '/login'}),(req,res)=>{
    const {Correo} = req.body;
    getDoctorbyEmail(Correo,doctor=>{
        res.redirect(`/doctor/${doctor.Id_Doctor}`)
    });
});

router.post('/login-pac',passport.authenticate('pac-sign',{failureRedirect: '/login-pac'}),(req,res)=>{
    const {Correo} = req.body;
    getPacienteByEmail(Correo,paciente=>{
        res.redirect(`/paciente/${paciente.Id_Paciente}`)
    });
});

router.get('/logout', (req, res, next)=>{
    req.logout(err_msg=>{
        if(err_msg){
            return next(err_msg); 
        }
        res.redirect('/');
    });
});

module.exports = router;