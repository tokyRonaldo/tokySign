import React ,{useState,useEffect}from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser,faLock } from '@fortawesome/free-solid-svg-icons';
import {Link,useNavigate} from 'react-router-dom'

function Register({setSurname}) {
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [error ,setError]=useState(null);
    const navigate=useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleRegister=async(e)=>{
        e.preventDefault();
        const response= await fetch(`${apiUrl}/sign/register`,{
            method : 'POST',
            headers :{
                "Content-Type": "application/json"
            },
            body : JSON.stringify({
                email: email,
                password : password,
                username : username
            })
        })
        const data = await response.json()
        if (!response.ok){
            setError(data.msg)
            return;
        }

        if(data.token){
            setError(null)
            setSurname(data.username)
            localStorage.setItem('token',data.token)
            navigate('/')
        }
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="card shadow p-4 rounded" style={{ width: '450px' }}>
                <h3 className="text-center mb-3">Register</h3>
                <form onSubmit={handleRegister}>
                    { error &&(<div className="view-error" style={{backgroundColor:'#f04747f5',textAlign:'center',color:'white',padding:'5px',borderRadius:'4px'}}><span>{error}</span> </div>)}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Username 
                        </label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                            <input type="text" className="form-control" id="username" name="username" placeholder="Username" required
                            onChange={(e)=>setUsername(e.target.value)}
                            />
                        </div>
                    </div>
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

                    <button type="submit" className="btn btn-primary w-100">Enregistrer</button>

                    <p className="text-center mt-3">
                        Déja un compte ? <Link to='/login' className="btn btn-success" > Login </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
