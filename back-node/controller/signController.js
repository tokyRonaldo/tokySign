const express = require('express');
const mongoose=require('mongoose')
const path = require('path');
const fs = require('fs');
const signModel = require('../model/signature');
const detailModel = require('../model/detail');

const addSign = async (req,res)=>{
    const details =  req.body;
    /*
    let files = [];

    if (req.files) {
        files = req.files.map(file => ({
            pdf_signed: file.path,  // Utilise le chemin du fichier
            pdf_original: file.originalname, // Stocke aussi le nom original
            user_id: req.user ? req.user._id : null // Récupère l'ID de l'utilisateur (ajuste selon ton auth)
        }));
    }    //const addSignature= await signModel.insert
    */
   /*let signed=null;
   let original=null;
   if (req.files){
     req.files.forEach(file=> {
        if(file.fieldname=='file_new'){
            signed = file.path
        }
        else if(file.fieldname=='file_original'){
            original = file.path
        }
    })
    }*/
    const fileData={
        pdf_signed: details.file_new,  // Utilise le chemin du fichier
        pdf_original: details.file_original, // Stocke aussi le nom original
        file_name: details.file_name, // Stocke aussi le nom original
        user_id: req.user ? req.user._id : null // Récupère l'ID de l'utilisateur (ajuste selon ton auth)

    }

    let response = await signModel.insertOne(fileData) 

    const detailData={
        nom: details.nom,  // Utilise le chemin du fichier
        titre: details.titre,  // Utilise le chemin du fichier
        adresse: details.adresse,  // Utilise le chemin du fichier
        email: details.email,  // Utilise le chemin du fichier
        phone: details.phone,  // Utilise le chemin du fichier
        signature_id: response._id,  // Utilise le chemin du fichier

    }


    let respDetail = await detailModel.insertOne(detailData)

    await res.json(response);

}

const getSign = (req,res)=>{
    return res.json('req.body');

}

const signHistorique = async (req,res) =>{
    //const result=  await Chat.find({'_id' : id});
    
// Récupère toutes les signatures de l'utilisateur
const signatures = await signModel.find({ user_id: req.user_id })
.sort({ createdAt: -1 }) // -1 pour l'ordre décroissant
.lean();

const signatureIds = signatures.map(sig => sig._id);

// Ensuite, récupère tous les détails associés à ces signatures
const details = await detailModel.find({
    signature_id: { $in: signatureIds }
}).lean();

// Fusionner les données
const results = signatures.map(sig => {
    const detail = details.find(d => d.signature_id.toString() === sig._id.toString());
    return {
        ...sig,
        detail: detail || null
    };
});

return res.json(results);


}

const downloadHistorique= async(req,res)=>{
    try{

        console.log(req.params.id);
        const file= await signModel.findById(req.params.id);
        if(!file || !file.pdf_signed){
            return res.status(401).json({error:'fichier non trouvé'})
        }
    
        //const file_path= path.join(__dirname,'..','uploads',file.pdf_signed); 
        //const file_path= path.join(__dirname,'..','',file.pdf_signed); //recuperer le chemin du fichier
        console.log('---------test---------------')
        /*console.log(file_path);
        if(!fs.existsSync(file_path)){
            return res.status(401).json({error:'fichier introuvable sur le serveur'})
        }*/
        console.log(' etooooo')
        //return res.download(file.pdf_signed, file.file_name); //telecharger le fichier
        return res.json(file);
         // Pour une URL Cloudinary, on fait un fetch puis on stream
    //const fetch = require('node-fetch'); // npm install node-fetch si pas installé
    
    //const response = await fetch(file.pdf_signed);
    
    /*if (!response.ok) {
      return res.status(404).json({ error: 'Fichier introuvable sur Cloudinary' });
    }*/

    // Définir les headers pour le téléchargement
    //res.setHeader('Content-Disposition', `attachment; filename="${file.file_name || 'document.pdf'}"`);
    //res.setHeader('Content-Type', 'application/pdf');
    
    // Stream le fichier directement au client
    //response.body.pipe(res);
    }
    catch(error){
        return res.status(500).json({error: 'Erreur lors du téléchargement'})
    }
}

module.exports={
    addSign,
    getSign,
    signHistorique,
    downloadHistorique
}