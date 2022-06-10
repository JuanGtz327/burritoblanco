const passport = require('passport');
const { getAdminbyEmail } = require('../controllers/adminController');
const { getDoctorbyEmail } = require('../controllers/doctorController');
const { getPacienteByEmail } = require('../controllers/pacienteController');
const LocalStrategy = require('passport-local').Strategy;

passport.use('adm-sign', new LocalStrategy({
    usernameField: "Correo",
    passwordField: 'Password',
    passReqToCallback: true
}, async (req,email, password, done) => {
    getAdminbyEmail(email, admin => {
        if (admin == -1) {
            return done(null, false, req.flash('err_msg', 'No existe ese administrador'));
        } else {
            if (admin.Password === password) {
                return done(null, admin);
            } else {
                return done(null, false, req.flash('err_msg', 'Contraseña Incorrecta'));
            }
        }
    })
})
);

passport.use('doc-sign', new LocalStrategy({
    usernameField: "Correo",
    passwordField: 'Password',
    passReqToCallback: true
}, async (req,email, password, done) => {
    getDoctorbyEmail(email, doctor => {
        if (doctor == -1) {
            return done(null, false, req.flash('err_msg', 'No existe ese doctor'));
        } else {
            if (doctor.Password === password) {
                return done(null, doctor);
            } else {
                return done(null, false, req.flash('err_msg', 'Contraseña Incorrecta'));
            }
        }
    })
})
);

passport.use('pac-sign', new LocalStrategy({
    usernameField: "Correo",
    passwordField: 'Password',
    passReqToCallback: true
}, async (req,email, password, done) => {
    getPacienteByEmail(email, paciente => {
        if (paciente == -1) {
            return done(null, false, req.flash('err_msg', 'No existe ese paciente'));
        } else {
            if (paciente.Password === password) {
                return done(null, paciente);
            } else {
                return done(null, false, req.flash('err_msg', 'Contraseña Incorrecta'));
            }
        }
    })
})
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    const { Correo, Domicilio, Especialidad } = user;
    if (Domicilio) {
        getPacienteByEmail(Correo, paciente => {
            if (paciente == -1) {
                return done(null, false, { err_msg: "No se encontro un paciente" });
            } else {
                let err = '';
                done(err, paciente);
            }
        })
    } else {
        if (Especialidad) {
            getDoctorbyEmail(Correo, doctor => {
                if (doctor == -1) {
                    return done(null, false, { err_msg: "No se encontro un doctor" });
                } else {
                    let err = '';
                    done(err, doctor);
                }
            })
        } else {
            getAdminbyEmail(Correo, admin => {
                if (admin == -1) {
                    return done(null, false, { err_msg: "No se encontro un admin" });
                } else {
                    let err = '';
                    done(err, admin);
                }
            })
        }
    }
});