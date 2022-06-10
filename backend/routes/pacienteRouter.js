const express = require('express');
const router = express.Router();

const { getPacientebyId, updatePaciente, updatePacienteWithPass, getPacienteByEmail } = require('../controllers/pacienteController');
const { getDoctorbyId } = require('../controllers/doctorController');
const { getHabitacionbyId } = require('../controllers/habitacionController');
const { getCitasbyIdPac } = require('../controllers/citaController');

const {getParsedDate} = require('../helpers/helpers');
const { getRecetasbyIdPac } = require('../controllers/recetaController');

const { pacAuth } = require('../helpers/auth');

//RUTAS PERFIL PACIENTE

router.get('/:idPac',pacAuth,(req,res)=>{
    const {idPac} = req.params;
    getPacientebyId(idPac,paciente=>{
        res.render('pacienteViews/index',paciente);
    })
});

router.get('/perfil/:idPac',pacAuth,(req,res)=>{
    const {idPac} = req.params;
    getPacientebyId(idPac,paciente=>{
        getDoctorbyId(paciente.Id_Doctor,doctor=>{
            getHabitacionbyId(paciente.Id_Habitacion ,habitacion=>{
                res.render('pacienteViews/perfilPacView',{paciente,doctor,habitacion});
            })
        })
    })
});

router.post('/updatePerfil/:idPac',pacAuth,(req,res)=>{
    const {idPac} = req.params;
    const {pass,pass2,Correo} = req.body;
    getPacienteByEmail(Correo,pacienteExist=>{
        if (pacienteExist.Id_Paciente==idPac) {
            if (pass.length>0 || pass2.length>0) {
                getPacientebyId(idPac,paciente=>{
                    if(paciente.Password!=pass){
                        req.flash('err_msg','Las contraseñas no coinciden');
                        res.redirect(`/paciente/${idPac}`);
                    }else{
                        updatePacienteWithPass(req.body,pass2,idPac,data=>{
                            req.flash('suc_msg', 'Perfil actualizado');
                            res.redirect(`/paciente/${idPac}`);
                        })
                    }
                })
            }else{
                updatePaciente(req.body,idPac,data=>{
                    req.flash('suc_msg', 'Perfil actualizado');
                    res.redirect(`/paciente/${idPac}`);
                });
            }
        }else{
            if (pacienteExist==-1) {
                if (pass.length>0 || pass2.length>0) {
                    getPacientebyId(idPac,paciente=>{
                        if(paciente.Password!=pass){
                            req.flash('err_msg','Las contraseñas no coinciden');
                            res.redirect(`/paciente/${idPac}`);
                        }else{
                            updatePacienteWithPass(req.body,pass2,idPac,data=>{
                                req.flash('suc_msg', 'Perfil actualizado');
                                res.redirect(`/paciente/${idPac}`);
                            })
                        }
                    })
                }else{
                    updatePaciente(req.body,idPac,data=>{
                        req.flash('suc_msg', 'Perfil actualizado');
                        res.redirect(`/paciente/${idPac}`);
                    });
                }
            }else{
                req.flash('err_msg', 'El correo introducido ya esta en uso');
                res.redirect(`/paciente/perfil/${idPac}`);
            }
        }
    })
});

//MANEJO DE CITAS DEL PACIENTE

router.get('/getCitas/:idPac',pacAuth,(req,res)=>{
    const {idPac} = req.params;
    getCitasbyIdPac(idPac,citas=>{
        citas.map(cita=>cita.Fecha=getParsedDate(cita.Fecha.toString()))
        res.render('adminViews/citaViews/getCitaView',{idPac,citas});
    })
});

//MANEJO RECETAS DEL PACIENTE

router.get('/getRecetas/:idPac',pacAuth,(req,res)=>{
    const {idPac} = req.params;
    getRecetasbyIdPac(idPac,recetas=>{
        res.render('adminViews/recetaViews/getRecetaView',{idPac,recetas});
    })
});

module.exports = router;