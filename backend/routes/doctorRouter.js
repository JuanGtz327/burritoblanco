const express = require('express');
const router = express.Router();

const { getPacientesByIdDoc, getPacientebyId, insertPaciente, updatePaciente, deletePaciente, getPacienteByEmail } = require('../controllers/pacienteController')
const { getDoctorbyId, updateDoctor, updateDoctorWithPass, getDoctorbyEmail } = require('../controllers/doctorController');
const { getHabitaciones } = require('../controllers/habitacionController');
const { getCitasbyIdDoc, insertCita, getCitabyId, updateCita, deleteCita, getCitasDoc } = require('../controllers/citaController')
const { getRecetasbyIdDoc, insertReceta, updateReceta, getRecetabyId, deleteReceta, getRecetasDoc } = require('../controllers/recetaController')

const { getParsedDate, validDate } = require('../helpers/helpers');
const { docAuth } = require('../helpers/auth');

//PERFIL

router.get('/:idDoc', docAuth, (req, res) => {
    const { idDoc } = req.params;
    let err;
    getDoctorbyId(idDoc, doctor => {
        res.render('doctorViews/index', doctor);
    })
});

router.get('/perfil/:idDoc', docAuth, (req, res) => {
    const { idDoc } = req.params;
    getDoctorbyId(idDoc, doctor => {
        res.render('doctorViews/perfilDocView', doctor);
    })
});

router.post('/updatePerfil/:idDoc', docAuth, (req, res) => {
    const { idDoc } = req.params;
    const { pass, pass2, Correo } = req.body;
    getDoctorbyEmail(Correo, doctorExist => {
        if (doctorExist.Id_Doctor == idDoc) {
            if (pass.length > 0 || pass2.length > 0) {
                getDoctorbyId(idDoc, doctor => {
                    if (doctor.Password != pass) {
                        req.flash('err_msg', 'Las contraseñas no coinciden');
                        res.redirect(`/doctor/${idDoc}`);
                    } else {
                        updateDoctorWithPass(req.body, pass2, idDoc, data => {
                            req.flash('suc_msg', 'Perfil actualizado');
                            res.redirect(`/doctor/${idDoc}`);
                        })
                    }
                })
            } else {
                updateDoctor(req.body, idDoc, data => {
                    req.flash('suc_msg', 'Perfil actualizado');
                    res.redirect(`/doctor/${idDoc}`);
                });
            }
        } else {
            if (doctorExist == -1) {
                if (pass.length > 0 || pass2.length > 0) {
                    getDoctorbyId(idDoc, doctor => {
                        if (doctor.Password != pass) {
                            req.flash('err_msg', 'Las contraseñas no coinciden');
                            res.redirect(`/doctor/${idDoc}`);
                        } else {
                            updateDoctorWithPass(req.body, pass2, idDoc, data => {
                                req.flash('suc_msg', 'Perfil actualizado');
                                res.redirect(`/doctor/${idDoc}`);
                            })
                        }
                    })
                } else {
                    updateDoctor(req.body, idDoc, data => {
                        req.flash('suc_msg', 'Perfil actualizado');
                        res.redirect(`/doctor/${idDoc}`);
                    });
                }
            } else {
                req.flash('err_msg', 'El correo introducido ya esta en uso');
                res.redirect(`/doctor/perfil/${idDoc}`);
            }
        }
    })
});

//MANEJO PACIENTES DEL DOCTOR

router.get('/getPacientes/:idDoc', docAuth, (req, res) => {
    const { idDoc } = req.params;
    getPacientesByIdDoc(idDoc, pacientes => {
        res.render('adminViews/pacienteViews/getPacienteView', { idDoc, pacientes });
    })
});

router.get('/addPaciente/:idDoc', docAuth, (req, res) => {
    const { idDoc } = req.params;
    getDoctorbyId(idDoc, doctor => {
        getHabitaciones(habitaciones => {
            res.render('signupPac', { idDoc, doctor, habitaciones });
        })
    })
});

router.post('/addPaciente/:idDoc', docAuth, (req, res) => {
    const { Correo, Password, Password2, idDoc } = req.body;
    getPacienteByEmail(Correo, pacienteExist => {
        if (pacienteExist == -1) {
            if (Password != Password2) {
                req.flash('err_msg', 'Las contraseñas no coinciden');
                res.redirect(`/doctor/addPaciente/${idDoc}`);
            } else {
                insertPaciente(req.body, (data, err_msg) => {
                    if (data == -1) {
                        req.flash('err_msg', err_msg);
                        res.redirect(`/doctor/addPaciente/${idDoc}`);
                    } else {
                        req.flash('suc_msg', 'Paciente añadido con exito');
                        res.redirect(`/doctor/${idDoc}`);
                    }
                })
            }
        } else {
            req.flash('err_msg', 'El correo introducido ya esta en uso');
            res.redirect(`/doctor/addPaciente/${idDoc}`);
        }
    });

});

router.get('/updatePaciente/:idPaciente/:idDoc', docAuth, (req, res) => {
    const { idPaciente } = req.params;
    getPacientebyId(idPaciente, paciente => {
        getDoctorbyId(paciente.Id_Doctor, doctor => {
            getHabitaciones(habitaciones => {
                const myHabs = habitaciones.filter(hab => hab.Id_Habitacion == paciente.Id_Habitacion);
                const myHab = myHabs[0].Habitacion;
                const idDoc = paciente.Id_Doctor;
                res.render('adminViews/pacienteViews/editPacienteView', { idDoc, paciente, doctor, myHab, habitaciones });
            })
        })
    });
});

router.post('/updatePaciente/:idPaciente/:idDoc', docAuth, (req, res) => {
    const { idPaciente } = req.params;
    const { idDoc, Correo } = req.body;
    getPacienteByEmail(Correo,pacienteExist=>{
        if (pacienteExist.Id_Paciente==idPaciente) {
            updatePaciente(req.body, idPaciente, data => {
                req.flash('suc_msg', 'Paciente actualizado');
                res.redirect(`/doctor/${idDoc}`);
            });
        }else{
            if (pacienteExist==-1) {
                updatePaciente(req.body, idPaciente, data => {
                    req.flash('suc_msg', 'Paciente actualizado');
                    res.redirect(`/doctor/${idDoc}`);
                });
            }else{
                req.flash('err_msg', 'El correo introducido ya esta en uso');
                res.redirect(`/doctor/updatePaciente/${idPaciente}/${idDoc}`);
            }
        }
    })
});

router.post('/deletePaciente/:idPaciente/:idDoc', docAuth, (req, res) => {
    const { idPaciente, idDoc } = req.params;
    deletePaciente(idPaciente, data => {
        req.flash('suc_msg', 'Paciente eliminado');
        res.redirect(`/doctor/${idDoc}`);
    });
});

//MANEJO DE CITAS DEL DOCTOR

router.get('/getCitas/:idDoc', docAuth, (req, res) => {
    const { idDoc } = req.params;
    getCitasDoc(idDoc, citas => {
        citas.map(cita => cita.Fecha = getParsedDate(cita.Fecha.toString()))
        res.render('adminViews/citaViews/getCitaView', { idDoc, citas });
    })
});

router.get('/addCita/:idDoc', docAuth, (req, res) => {
    const { idDoc } = req.params;
    getDoctorbyId(idDoc, doctor => {
        getPacientesByIdDoc(idDoc, pacientes => {
            res.render('adminViews/citaViews/addCitaView', { idDoc, doctor, pacientes });
        })
    })
});

router.post('/addCita/:idDoc', docAuth, (req, res) => {
    const { Fecha, idDoc } = req.body;
    if (validDate(Fecha) == 0) {
        insertCita(req.body, (data, err_msg) => {
            if (data == -1) {
                req.flash('err_msg', err_msg);
                res.redirect(`/doctor/addCita/${idDoc}`);
            } else {
                req.flash('suc_msg', 'Cita añadida con exito');
                res.redirect(`/doctor/${idDoc}`);
            }
        })
    } else {
        req.flash('err_msg', `Horario de cita no valido, ${validDate(Fecha)}`);
        res.redirect(`/doctor/addCita/${idDoc}`);
    }
});

router.get('/updateCita/:idCita/:idDoc', docAuth, (req, res) => {
    const { idCita } = req.params;
    getCitabyId(idCita, cita => {
        getDoctorbyId(cita.Id_Doctor, doctor => {
            getPacientebyId(cita.Id_Paciente, patient => {
                cita.Fecha = getParsedDate(cita.Fecha.toString());
                const idDoc = cita.Id_Doctor;
                res.render('adminViews/citaViews/editCitaView', { idDoc, cita, doctor, patient });
            })
        })
    });
});

router.post('/updateCita/:idCita/:idDoc', docAuth, (req, res) => {
    const { idCita } = req.params;
    const { Fecha, idDoc } = req.body;
    if (validDate(Fecha) == 0) {
        updateCita(req.body, idCita, data => {
            req.flash('suc_msg', 'Cita actualizada');
            res.redirect(`/doctor/${idDoc}`);
        });
    } else {
        req.flash('err_msg', `Horario de cita no valido, ${validDate(Fecha)}`);
        res.redirect(`/doctor/updateCita/${idCita}/${idDoc}`);
    }
});

router.post('/deleteCita/:idCita/:idDoc', docAuth, (req, res) => {
    const { idCita, idDoc } = req.params;
    deleteCita(idCita, data => {
        req.flash('suc_msg', 'Cita eliminada');
        res.redirect(`/doctor/${idDoc}`);
    });
});

//MANEJO RECETAS DEL DOCTOR

router.get('/getRecetas/:idDoc', docAuth, (req, res) => {
    const { idDoc } = req.params;
    getRecetasDoc(idDoc, recetas => {
        res.render('adminViews/recetaViews/getRecetaView', { idDoc, recetas });
    })
});

router.get('/addReceta/:idDoc', docAuth, (req, res) => {
    const { idDoc } = req.params;
    getCitasbyIdDoc(idDoc, citas => {
        res.render('adminViews/recetaViews/addRecetaView', { idDoc, citas });
    })
});

router.post('/addReceta/:idDoc', docAuth, (req, res) => {
    insertReceta(req.body, (data, err_msg) => {
        if (data == -1) {
            req.flash('err_msg', err_msg);
            res.redirect(`/doctor/addPaciente/${idDoc}`);
        } else {
            const { idDoc } = req.params;
            req.flash('suc_msg', 'Receta añadida con exito');
            res.redirect(`/doctor/${idDoc}`);
        }
    })
});

router.get('/updateReceta/:idReceta/:idDoc', docAuth, (req, res) => {
    const { idReceta, idDoc } = req.params;
    getRecetabyId(idReceta, receta => {
        getCitabyId(receta.Id_Cita, cita => {
            res.render('adminViews/recetaViews/editRecetaView', { idDoc, receta, cita });
        })
    });
});

router.post('/updateReceta/:idReceta/:idDoc', docAuth, (req, res) => {
    const { idReceta,idDoc } = req.params;
    updateReceta(req.body, idReceta, data => {
        req.flash('suc_msg', 'Receta actualizada');
        res.redirect(`/doctor/${idDoc}`);
    });
});

router.post('/deleteReceta/:idReceta/:idDoc', docAuth, (req, res) => {
    const { idReceta, idDoc } = req.params;
    deleteReceta(idReceta, data => {
        req.flash('suc_msg', 'Receta eliminada');
        res.redirect(`/doctor/${idDoc}`);
    });
});

module.exports = router;