const express = require('express');
const dotenv = require ('dotenv');
const cors =require ('cors');
const bodyParser = require('body-parser')
const connectDb = require('./config/db');
const signRoute = require('./route/route')
//const jwt = require('jsonwebtoken')
const multer = require("multer");
const path = require('path');

const app = express();
const port = 3001;

dotenv.config();

// Middleware pour servir les fichiers statiques depuis le dossier "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin: process.env.FRONT_URL, // URL de ton application React
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
    //allowedHeaders: ['Content-Type', 'Authorization']
  }));
//app.use(bodyParser.json());

app.use(express.json());  // Ajoute le middleware pour parser JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les données des formulaires


connectDb();
// Middleware pour FormData
//const upload = multer();


app.use('/sign',signRoute);
/*app.post('/sign/add', upload.any(), (req, res) => {
  console.log(req.body);
  //console.log(req.headers)
    res.send('Hello Node.js!');
});*/





app.listen(port, () => console.log('Serveur démarré sur http://localhost:3001'));
