import { useState,useEffect,useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
/*import './App.css'*/
import '../assets/style.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes,faGripLines } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, Save, Clock, Menu, ChevronLeft, ChevronRight ,Download ,Calendar} from 'lucide-react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"


function Header({headerHeight,setHeaderHeight,isOpen,setIsOpen,listHistorique , surName}) {
  const [count, setCount] = useState(0);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [login, setLogin] = useState(null);
  //const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token= localStorage.getItem('token');
  const navigate=useNavigate();

  const togglePopup = () => {
    setIsUserOpen(!isUserOpen);
  };

  const logout = async ()=>{
      localStorage.removeItem("token");
      navigate('/login');
  }


  useEffect(() => {

    const t = localStorage.getItem('token');
    setLogin(t);

    //gerer le margin du header fix
    const updateHeaderHeight = () => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    };

    updateHeaderHeight(); // Met à jour au premier rendu
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
        window.removeEventListener("resize", updateHeaderHeight);
    };
}, [headerHeight]);


const downloadHistorique = async(item)=>{
  const response = await fetch(`${apiUrl}/sign/downloadHistorique/${item._id}`,{
    method : 'GET',
    headers :{
      "Content-Type": "application/json",
      'Authorization' : 'Bearer ' + token
    }
  })
  if (!response.ok){
    console.log('error');
    return ;
  }
  console.log(response);
}

  return (
            <div className="signHeader" ref={headerRef}>
                {/*<div className="signTitle">
                    <h1 className="signH1">signToky</h1>
                </div>
                <div className="signOption">
                    <div className="historique">historique</div>
                    <div className="user">user</div>
                </div>*/}
                 <button onClick={() => setIsOpen(!isOpen)} style={{ fontSize: "24px", cursor: "pointer",borderRadius:'7px' }}>
                    {isOpen ? (
                    <FontAwesomeIcon icon={faBars} /> // Icône de fermeture
                    ) : (
                    <FontAwesomeIcon icon={faTimes} /> // Icône d'ouverture
                    )}
                </button>
                <div className="flex items-center gap-4 ml-auto signOption">
              {/* Modal d'historique */}
              <Dialog>
                <DialogTrigger asChild>
                <Button disabled={!token} variant="ghost" className="flex items-center gap-2 mr-4 btn-historique">
                            <Clock className="h-5 w-5" />
                            <span className="hidden sm:inline">Historique</span>
                </Button>
                        
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Historique des signatures
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Signé par</TableHead>
                          <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {listHistorique.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-teal-600" />
                                {item.file_name}
                              </div>
                            </TableCell>
                            <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                            <TableCell>{item.detail?.nom}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 downloadHistory group"
                              onClick={()=>{
                                downloadHistorique(item)
                              }}
                              >
                                <Download className="h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:scale-125 group-hover:text-blue-600"  />
                                <span className="sr-only">Télécharger</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))} 
                      </TableBody> 
                    </Table>
                  </div> 
                </DialogContent>
              </Dialog>
              
              <div className='aboutUser'  >
                    <div className='about-div' onClick={togglePopup} style={{cursor : 'pointer'}}>
                        <span className='email-span'>{surName}</span>
                    </div>
                    {isUserOpen && (
                        <div className="popup">
                            <button onClick={() => logout()}>Logout</button>
                        </div>
                     )}
              </div>

            </div>

          </div>

 
  )
}

export default Header;
