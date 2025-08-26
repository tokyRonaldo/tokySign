import React ,{useState,useEffect}from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

function Login({setSurname}) {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [error ,setError]=useState(null);
    const navigate=useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleLogin=async(e)=>{
        e.preventDefault();
        const response= await fetch(`${apiUrl}/sign/login`,{
            method : 'POST',
            headers :{
                "Content-type" : "application/json"
            },
            body : JSON.stringify({
                email: email,
                password : password
            })
        })
        const data = await response.json()
        if (!response.ok){
            setError(data.msg)
            return;
        }

        if(data.token){
            setError(null)
            console.log(data);
            let surname= data.user.username;
            setSurname(surname ? (surname.substring(0,2)).toUpperCase() : 'TR');
            localStorage.setItem('token',data.token)

            navigate('/')
        }
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="card shadow p-4 rounded" style={{ width: '450px' }}>
                <h3 className="text-center mb-3">Connexion</h3>
                <form onSubmit={handleLogin}>
                    { error &&(<div className="view-error" style={{backgroundColor:'#f04747f5',textAlign:'center',color:'white',padding:'5px',borderRadius:'4px'}}><span>{error}</span> </div>)}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Adresse e-mail 
                        </label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                            <input type="email" className="form-control" id="email" name="email" placeholder="Entrez votre email" required
                            onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Mot de passe 
                        </label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input type="password" className="form-control" id="password" name="password" placeholder="Entrez votre mot de passe" required 
                            onChange={(e)=>setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Se connecter</button>

                    <p className="text-center mt-3">
                        Pas encore de compte ? <Link  to="/register" className="text-primary">Inscrivez-vous</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
