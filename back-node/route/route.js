const express= require('express');
const router =express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Dossier de destination
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
  
const upload = multer({ storage });

const signMiddleware = require('../middleware/signMiddleware')

const {
    addSign,
    getSign,
    signHistorique,
    downloadHistorique

} = require('../controller/signController');

const{
  login,
  register,
  getUser
} = require('../controller/authController')

/*router.post('/add',(req,res)=>{
    //res.json('test') 
    console.log('trest');
})*/

router.post('/add',upload.any(),addSign);

router.post('/login',login);

router.post('/register',register);

router.get('/signHistorique',signHistorique);

router.get('/downloadHistorique/:id',downloadHistorique);

router.get('/getUser',signMiddleware,getUser);

module.exports = router;