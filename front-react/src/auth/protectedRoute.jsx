import React,{useEffect,useState} from 'react';
import { Navigate } from "react-router-dom";

const protectedRoute=({children})=>{
    const isAuthenticated = localStorage.getItem('token');
    console.log(isAuthenticated);
    console.log('test--------------------');
    return isAuthenticated ? children :  <Navigate to="/login" />;

}
export default protectedRoute;