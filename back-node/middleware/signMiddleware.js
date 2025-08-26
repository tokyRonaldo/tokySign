const express = require('express');
const userModel = require('../model/user');
const jwt = require('jsonwebtoken');

async function signMiddleware(req, res, next) {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({
            msg: "Erreur d'autorisation, aucun token fourni ou format incorrect"
        });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), "secretKey123");
        // ⬇️ Ici tu avais oublié le `await`
        const user = await userModel.findById(decoded._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'Token invalide ou expiré',
            error: error.message
        });
    }
}

module.exports = signMiddleware;
