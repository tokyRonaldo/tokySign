const express = require('express');
const signModel = require('../model/signature');
const userModel = require('../model/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function login(req,res){
    const params=req.body;
    console.log('etoooooo---------------')
    console.log(params);
    try{
        let user = await userModel.findOne({email:params.email})
        if(!user){
            return res.status(401).json({
                'msg':'mauvaise identifiant'
            })
        }
        const isValidPassword= await bcrypt.compare(params.password,user.password)
        if(!isValidPassword){
            return res.status(401).json({
                'msg':'mauvaise identifiant'
            })
        }
        
        const token = jwt.sign({'_id': user._id},'secretKey123')
        console.log(user)
        return res.status(201).json({
            'msg' : 'identification avec succes',
            'token' : token,
            'user' : user
        })
    }
    catch(error){
        return res.status(500).json({
            'msg':error.message
        })
    }


}

async function register(req,res){
    const params=req.body
    console.log('here---------------')
    //const register=
    console.log(params)
    try{
        const user= await userModel.findOne({email:params.email});
        if(user){
            return res.status(401).json({
                'msg':'mail existe deja'
            });
        }

        let hashPassword= await bcrypt.hash(params.password,12);
        const newUser = await userModel.create({
            email : params.email,
            username : params.username,
            password : hashPassword
        });

        let token =  jwt.sign({'_id':newUser._id},'secretKey123');

        return res.status(201).json({
            'msg':'enregistrer avec succes',
            'token':token
        })
    }
    catch(error){
        return res.status(500).json({
            'msg': error.message,
            'user': newUser
        })
    }
    res.json(data);
}

async function getUser(req,res){
    response= await userModel.findById(req.user._id);
    return res.json(response)
}

module.exports ={
    login,
    register,
    getUser
}