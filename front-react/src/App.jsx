import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
/*import './App.css'*/
import './assets/style.css'
import Index from './container/index'
import Login from './auth/login'
import Register from './auth/register'
import ProtectedRoute from './auth/protectedRoute'
import ProtectedAuth from './auth/protectedAuth'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function App() {
  const [count, setCount] = useState(0)
  const [listHistorique,setListHistorique]=useState([]);
  const token= localStorage.getItem('token');
  const [surName,setSurname]= useState(null);
  const [user,setUser]=useState({});
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(()=>{
    getHistorique();
    getSurName();
  },[])

  const getSurName= async()=>{
    if(token){

      try {
          const response = await fetch(`${apiUrl}/sign/getUser`, {
              method: "get",
              headers: {
                  "Content-Type": "application/json",
                  'Authorization' : 'Bearer ' + token
              }
          });

          if (response.ok) {
              const resp = await response.json()
              console.log(resp);
              setUser(resp)
              let surname= resp.username;
              setSurname(surname ? (surname.substring(0,2)).toUpperCase() : 'TR');

          } 
      } catch (error) {
          console.error("Erreur lors de la recuperation de l'utilisateur :", error);
      }
    }
    else{
      setSurname('TR');

    }
  }

  const getHistorique= async() =>{
    if(token){

      try {
          const response = await fetch(`${apiUrl}/sign/signHistorique`, {
              method: "get",
              headers: {
                  //"Content-Type": "application/json",
                  'Authorization' : 'Bearer ' + token
              }
          });

          if (response.ok) {
              const resp = await response.json()
              setListHistorique(resp)
          } 
      } catch (error) {
          console.error("Erreur lors de l'envoi du fichier :", error);
      }
    }
    else{
      console.log("erreur d'authorization")
    }
  }

  return (
    <>
      <div>
      <Router>
        <Routes>
          <Route path='/' element={ <Index getHistorique={getHistorique} listHistorique={listHistorique} surName={surName} />} />
          <Route path='/login' element={<ProtectedAuth><Login setSurname={setSurname} /></ProtectedAuth>} />
          <Route path='/register' element={<ProtectedAuth><Register setSurname={setSurname} /></ProtectedAuth>  } />
        </Routes>
      </Router>
      </div>
 
    </>
  )
}

export default App
