const express = require('express');
const router = express.Router();

const { insertDoctor, getDoctors, updateDoctor, deleteDoctor, getDoctorbyId, getDoctorbyEmail } = require('../controllers/doctorController');
const { getPacientes, insertPaciente, getPacientebyId, updatePaciente, deletePaciente, getPacienteByEmail, getPacientesAdmin } = require('../controllers/pacienteController')
const { getHabitaciones, insertHabitacion, getHabitacionbyId, updateHabitacion, deleteHabitacion } = require('../controllers/habitacionController');
const { getCitas, getCitasAdmin, insertCita, getCitabyId, updateCita, deleteCita } = require('../controllers/citaController')
const { getRecetas, insertReceta, updateReceta, getRecetabyId, deleteReceta, getRecetasAdmin } = require('../controllers/recetaController')

const { getParsedDate, validDate } = require('../helpers/helpers');
const { admAuth } = require('../helpers/auth');

router.get('/dashboard', admAuth, (req, res) => {
    getDoctors(doctors => {
        res.render('adminViews/dashboardViews/dashboardDoctorsView', { doctors });
    })
});

router.get('/dashboard/pacientes', admAuth, (req, res) => {
    getPacientes(pacientes => {
        res.render('adminViews/dashboardViews/dashboardPacientesView', { pacientes });
    })
});

router.get('/dashboard/habitaciones', admAuth, (req, res) => {
    getHabitaciones(habitaciones => {
        res.render('adminViews/dashboardViews/dashboardHabView', { habitaciones });
    })
});

router.get('/dashboard/citas', admAuth, (req, res) => {
    getCitas(citas => {
        citas.map(cita => cita.Fecha = getParsedDate(cita.Fecha.toString()))
        res.render('adminViews/dashboardViews/dashboardCitasView', { citas });
    })
});

router.get('/dashboard/recetas', admAuth, (req, res) => {
    getRecetas(recetas => {
        res.render('adminViews/dashboardViews/dashboardRecetaView', { recetas });
    })
});

//RUTAS MANEJO DOCTORES

router.get('/getDoctors', admAuth, (req, res) => {
    getDoctors(doctors => {
        res.render('adminViews/doctorViews/getDoctorView', { doctors });
    })
});

router.get('/addDoctor', admAuth, (req, res) => {
    res.render('signupDoc');
});

router.post('/addDoctor', admAuth, (req, res) => {
    const { Correo, Password, Password2 } = req.body;
    getDoctorbyEmail(Correo, doctorExist => {
        if (doctorExist == -1) {
            if (Password != Password2) {
                req.flash('err_msg', 'Las contraseñas no coinciden');
                res.redirect('/admin/addDoctor');
            } else {
                insertDoctor(req.body, (data, err_msg) => {
                    if (data == -1) {
                        res.render('adminViews/doctorViews/addDoctorView', { err_msg });
                    } else {
                        const { Correo } = req.body;
                        req.flash('suc_msg', 'Doctor agregado con exito');
                        res.redirect('/admin/getDoctors');
                    }
                });
            }
        } else {
            req.flash('err_msg', 'El correo introducido ya esta en uso');
            res.redirect('/admin/addDoctor');
        }
    })
});

router.get('/updateDoctor/:idDoctor', admAuth, (req, res) => {
    const { idDoctor } = req.params;
    getDoctorbyId(idDoctor, doctor => {
        res.render('adminViews/doctorViews/editDoctorView', doctor);
    });
});

router.post('/updateDoctor/:idDoctor', admAuth, (req, res) => {
    const { idDoctor } = req.params;
    const { Correo } = req.body;
    getDoctorbyEmail(Correo, doctorExist => {
        if (doctorExist == -1) {
            updateDoctor(req.body, idDoctor, data => {
                req.flash('suc_msg', 'Doctor actualizado');
                res.redirect('/admin/getDoctors');
            });
        } else {
            if (doctorExist.Id_Doctor==idDoctor){
                updateDoctor(req.body, idDoctor, data => {
                    req.flash('suc_msg', 'Doctor actualizado');
                    res.redirect('/admin/getDoctors');
                });
            }else{
                req.flash('err_msg', 'El correo introducido ya esta en uso');
                res.redirect(`/admin/updateDoctor/${idDoctor}`);
            }
        }
    })
});

router.post('/deleteDoctor/:idDoctor', admAuth, (req, res) => {
    const { idDoctor } = req.params;
    deleteDoctor(idDoctor, data => {
        req.flash('suc_msg', 'Doctor eliminado');
        res.redirect('/admin/dashboard');
    });
});

//RUTAS MANEJO PACIENTES
router.get('/getPacientes', admAuth, (req, res) => {
    getPacientesAdmin(pacientes => {
        res.render('adminViews/pacienteViews/getPacienteView', { pacientes });
    })
});

router.get('/addPaciente', admAuth, (req, res) => {
    getDoctors(doctores => {
        getHabitaciones(habitaciones => {
            res.render('signupPac', { doctores, habitaciones });
        })
    })
});

router.post('/addPaciente', admAuth, (req, res) => {
    const { Correo, Password, Password2 } = req.body;
    getPacienteByEmail(Correo, pacienteExist => {
        if (pacienteExist == -1) {
            if (Password != Password2) {
                req.flash('err_msg', 'Las contraseñas no coinciden');
                res.redirect('/admin/addPaciente');
            } else {
                insertPaciente(req.body, (data, err_msg) => {
                    if (data == -1) {
                        res.render('adminViews/pacienteViews/addPacienteView', { err_msg });
                    } else {
                        req.flash('suc_msg', 'Paciente añadido con exito');
                        res.redirect('/admin/getPacientes');
                    }
                })
            }
        } else {
            req.flash('err_msg', 'El correo introducido ya esta en uso');
            res.redirect('/admin/addPaciente');
        }
    });
});

router.get('/updatePaciente/:idPaciente', admAuth, (req, res) => {
    const { idPaciente } = req.params;
    console.log(idPaciente);
    getPacientebyId(idPaciente, paciente => {
        getDoctors(doctores => {
            getHabitaciones(habitaciones => {
                const myDoctors = doctores.filter(doctor => doctor.Id_Doctor == paciente.Id_Doctor);
                const myDoctor = myDoctors[0].Nombre;
                const myHabs = habitaciones.filter(hab => hab.Id_Habitacion == paciente.Id_Habitacion);
                const myHab = myHabs[0].Habitacion;
                res.render('adminViews/pacienteViews/editPacienteView', { paciente, myDoctor, myHab, doctores, habitaciones });
            })
        })
    });
});

router.post('/updatePaciente/:idPaciente', admAuth, (req, res) => {
    const { idPaciente } = req.params;
    const { Correo } = req.body;
    getPacienteByEmail(Correo,pacienteExist=>{
        if (pacienteExist.Id_Paciente==idPaciente) {
            updatePaciente(req.body, idPaciente, data => {
                req.flash('suc_msg', 'Paciente actualizado');
                res.redirect('/admin/getPacientes');
            });
        }else{
            if (pacienteExist==-1) {
                updatePaciente(req.body, idPaciente, data => {
                    req.flash('suc_msg', 'Paciente actualizado');
                    res.redirect('/admin/getPacientes');
                });
            }else{
                req.flash('err_msg', 'El correo introducido ya esta en uso');
                res.redirect(`/admin/updatePaciente/${idPaciente}`);
            }
        }
    })
});

router.post('/deletePaciente/:idPaciente', admAuth, (req, res) => {
    const { idPaciente } = req.params;
    deletePaciente(idPaciente, data => {
        req.flash('suc_msg', 'Paciente eliminado');
        res.redirect('/admin/dashboard');
    });
});

//RUTAS MANEJO HABITACIONES

router.get('/getHabitaciones', admAuth, (req, res) => {
    getHabitaciones(habitaciones => {
        res.render('adminViews/habViews/getHabView', { habitaciones });
    })
});

router.get('/addHabitacion', admAuth, (req, res) => {
    res.render('adminViews/habViews/addHabView');
});

router.post('/addHabitacion', admAuth, (req, res) => {
    insertHabitacion(req.body, (data, err_msg) => {
        if (data == -1) {
            res.render('adminViews/addHabView', { err_msg });
        } else {
            req.flash('suc_msg', 'Habitacion añadida con exito');
            res.redirect('/admin/getHabitaciones');
        }
    })
});

router.get('/updateHabitacion/:idHab', admAuth, (req, res) => {
    const { idHab } = req.params;
    getHabitacionbyId(idHab, habitacion => {
        res.render('adminViews/habViews/editHabView', habitacion);
    });
});

router.post('/updateHabitacion/:idHab', admAuth, (req, res) => {
    const { idHab } = req.params;
    updateHabitacion(req.body, idHab, data => {
        req.flash('suc_msg', 'Habitacion actualizado');
        res.redirect('/admin/getHabitaciones');
    });
});

router.post('/deleteHabitacion/:idHab', admAuth, (req, res) => {
    const { idHab } = req.params;
    deleteHabitacion(idHab, data => {
        req.flash('suc_msg', 'Habitacion eliminada');
        res.redirect('/admin/dashboard');
    });
});

//MANEJO DE CITAS

router.get('/getCitas', admAuth, (req, res) => {
    getCitasAdmin(citas => {
        citas.map(cita => cita.Fecha = getParsedDate(cita.Fecha.toString()))
        res.render('adminViews/citaViews/getCitaView', { citas });
    })
});

router.get('/addCita', admAuth, (req, res) => {
    getDoctors(doctores => {
        getPacientes(pacientes => {
            res.render('adminViews/citaViews/addCitaView', { doctores, pacientes });
        })
    })
});

router.post('/addCita', admAuth, (req, res) => {
    const { Fecha } = req.body;
    if (validDate(Fecha) == 0) {
        insertCita(req.body, (data, err_msg) => {
            if (data == -1) {
                res.render('adminViews/citaViews/addCitaView', { err_msg });
            } else {
                req.flash('suc_msg', 'Cita añadida con exito');
                res.redirect('/admin/getCitas');
            }
        })
    } else {
        req.flash('err_msg', `Horario de cita no valido, ${validDate(Fecha)}`);
        res.redirect('/admin/addCita');
    }
});

router.get('/updateCita/:idCita', admAuth, (req, res) => {
    const { idCita } = req.params;
    getCitabyId(idCita, cita => {
        getDoctors(doctores => {
            getPacientes(pacientes => {
                cita.Fecha = getParsedDate(cita.Fecha.toString())
                const myDoctors = doctores.filter(doctor => doctor.Id_Doctor == cita.Id_Doctor);
                const myDoctor = myDoctors[0].Nombre;
                const myPacs = pacientes.filter(pac => pac.Id_Paciente == cita.Id_Paciente);
                const myPac = myPacs[0].Nombre;
                res.render('adminViews/citaViews/editCitaView', { cita, myDoctor, myPac, doctores, pacientes });
            })
        })
    });
});

router.post('/updateCita/:idCita', admAuth, (req, res) => {
    const { idCita } = req.params;
    const { Fecha } = req.body;
    if (validDate(Fecha) == 0) {
        updateCita(req.body, idCita, data => {
            req.flash('suc_msg', 'Cita actualizada');
            res.redirect('/admin/getCitas');
        });
    } else {
        req.flash('err_msg', `Horario de cita no valido, ${validDate(Fecha)}`);
        res.redirect(`/admin/updateCita/${idCita}`);
    }
});

router.post('/deleteCita/:idCita', admAuth, (req, res) => {
    const { idCita } = req.params;
    deleteCita(idCita, data => {
        req.flash('suc_msg', 'Cita eliminada');
        res.redirect('/admin/dashboard');
    });
});

//MANEJO RECETAS

router.get('/getRecetas', admAuth, (req, res) => {
    getRecetasAdmin(recetas => {
        res.render('adminViews/recetaViews/getRecetaView', { recetas });
    })
});

router.get('/addReceta', admAuth, (req, res) => {
    getCitas(citas => {
        res.render('adminViews/recetaViews/addRecetaView', { citas });
    })
});

router.post('/addReceta', admAuth, (req, res) => {
    insertReceta(req.body, (data, err_msg) => {
        if (data == -1) {
            res.render('adminViews/recetaViews/addRecetaView', { err_msg });
        } else {
            req.flash('suc_msg', 'Receta añadida con exito');
            res.redirect('/admin/getRecetas');
        }
    })
});

router.get('/updateReceta/:idReceta', admAuth, (req, res) => {
    const { idReceta } = req.params;
    getRecetabyId(idReceta, receta => {
        getCitas(citas => {
            res.render('adminViews/recetaViews/editRecetaView', { receta, citas });
        })
    });
});

router.post('/updateReceta/:idReceta', admAuth, (req, res) => {
    const { idReceta } = req.params;
    updateReceta(req.body, idReceta, data => {
        req.flash('suc_msg', 'Receta actualizada');
        res.redirect('/admin/getRecetas');
    });
});

router.post('/deleteReceta/:idReceta', admAuth, (req, res) => {
    const { idReceta } = req.params;
    deleteReceta(idReceta, data => {
        req.flash('suc_msg', 'Receta eliminada');
        res.redirect('/admin/dashboard');
    });
});

module.exports = router;