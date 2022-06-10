const jwt = require('jsonwebtoken');
const { getDoctorbyEmail } = require('../controllers/doctorController');

const protectDoc = (req,res,next)=>{
    let token;
    console.log(req.params);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            getDoctorbyEmail(decoded.id,doctor=>{
                if(doctor!=-1)
                    next();
            })
        } catch (error) {
            let err = 'Usuario no autorizado';
            res.redirect('/',{err});
        }
    }

    if (!token) {
        let err = 'Usuario no autorizado, token invalido';
        res.render('home',{err});
    }
}

const protectPac = (req,res,next)=>{
    let token;
    console.log(req.params);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            getDoctorbyEmail(decoded.id,doctor=>{
                if(doctor!=-1)
                    next();
            })
        } catch (error) {
            let err = 'Usuario no autorizado';
            res.redirect('/',{err});
        }
    }

    if (!token) {
        let err = 'Usuario no autorizado, token invalido';
        res.render('home',{err});
    }
}

module.exports = {
    protectDoc,
    protectPac
}