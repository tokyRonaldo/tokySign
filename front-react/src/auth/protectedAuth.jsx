import React,{useEffect,useState} from 'react';
import { Navigate } from "react-router-dom";

const protectedAuth=({children})=>{
    const isAuthenticated = localStorage.getItem('token');
    console.log(isAuthenticated);
    console.log('test--------------------');
    return isAuthenticated ? <Navigate to="/" /> : children ;

}
export default protectedAuth;