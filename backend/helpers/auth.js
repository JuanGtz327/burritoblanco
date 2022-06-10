const { getAdminbyId } = require("../controllers/adminController");
const { getDoctorbyId } = require("../controllers/doctorController");
const { getPacientebyId } = require("../controllers/pacienteController");

const admAuth = (req, res, next) => {
  if (req.user===undefined) {
    res.render('login',{err_msg:'Por favor inicie sesion'});
  }else{
    const {Id_Administrador} = req.user;
    if(Id_Administrador===undefined){
      req.logout(err=>{
        if(err){
            return next(err); 
        }
        res.render('index',{err_msg:'Error en las credenciales de usuario'});
      });
    }else{
      if (req.isAuthenticated()) {
        getAdminbyId(Id_Administrador,admin=>{
          if(admin.Correo=='admin@gmail.com'){
            return next();
          }else{
            req.logout(err_msg=>{
              if(err_msg) return next(err_msg);
              req.flash('err_msg','Usuario no autorizado');
              res.redirect('/');
            });
          }
        })
      }else{
        res.render('login',{err_msg:'Sesion Inactiva'});
      }
    }
  }
};

const docAuth = (req, res, next) => {
  if (req.user===undefined) {
    res.render('login',{err_msg:'Por favor inicie sesion'});
  }else{
    const {Id_Doctor} = req.user;
    const {idDoc} = req.params;
    if (req.isAuthenticated()) {
      getDoctorbyId(idDoc,realDoc=>{
        getDoctorbyId(Id_Doctor,currentDoc=>{
          if(realDoc.Correo==currentDoc.Correo){
            return next();
          }else{
            req.logout(err_msg=>{
              if(err_msg) return next(err_msg);
              req.flash('err_msg','Usuario no autorizado');
              res.redirect('/');
            });
          }
        })
      })
    }else{
      res.render('login',{err_msg:'Sesion Inactiva'});
    }
  }
};

const pacAuth = (req, res, next) => {
  if (req.user===undefined) {
    res.render('login',{err_msg:'Por favor inicie sesion'});
  }else{
    const {Id_Paciente} = req.user;
    const {idPac} = req.params;
    
    if(Id_Paciente === undefined || idPac===undefined){
      req.logout(err=>{
        if(err){
            return next(err); 
        }
        res.render('index',{err_msg:'Error en las credenciales de usuario'});
      });
    }else{
      if (req.isAuthenticated()) {
        getPacientebyId(idPac,realPac=>{
          getPacientebyId(Id_Paciente,currentPac=>{
            if(realPac.Correo==currentPac.Correo){
              return next();
            }else{
              req.logout(err_msg=>{
                if(err_msg) return next(err_msg);
                req.flash('err_msg','Usuario no autorizado');
                res.redirect('/');
              });
            }
          })
        })
      }else{
        res.render('login',{err_msg:'Sesion Inactiva'});
      }
    }
  }
};

module.exports = {
  admAuth,
  docAuth,
  pacAuth,
}