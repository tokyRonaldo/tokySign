import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../assets/style.css";
import Home from "../container/home";
import Header from "./header";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./sortableItem";

function Index({getHistorique,listHistorique,surName}) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const[titre, setTitre] = useState('')
  const[nom, setNom] = useState('')
  const[phone, setPhone] = useState('')
  const[email, setEmail] = useState('')
  const[adresse, setAdresse] = useState('')
  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token= localStorage.getItem('token');


  const signContainerRef = useRef(0);
  const sidebarRef = useRef(0);
  //const headerRef = useRef(null);
  const handleSidebar=()=>{
    const widthSidebar = sidebarRef.current.offsetWidth;
    if(isOpen){
      signContainerRef.current.style.marginLeft = '20%';
    }
    else{
      signContainerRef.current.style.marginLeft = `0px`;
      sidebarRef.current.display = 'none';

    }
    console.log(widthSidebar);
    console.log(isOpen);

  } 
  useEffect(()=>{
    handleSidebar();
  },[isOpen])
  
  const initialFields = [
    { id: "name", label: "Name", type: "text", value: "" },
    { id: "title", label: "Title", type: "text", value: "" },
    { id: "company", label: "Company", type: "text", value: "" },
    { id: "companySize", label: "Company Size", type: "select", value: "", options: ["Small", "Medium", "Large"] },
    { id: "mobile", label: "Mobile", type: "text", value: "" },
    { id: "phone", label: "Phone", type: "text", value: "" },
    { id: "website", label: "Website", type: "text", value: "" },
    { id: "email", label: "Email", type: "email", value: "" },
    { id: "address", label: "Address", type: "text", value: "" },
  ];

  const [fields, setFields] = useState(initialFields);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return; // ✅ Éviter les erreurs si `over` est null

    if (active.id !== over.id) {
      setFields((fields) => {
        const oldIndex = fields.findIndex((item) => item.id === active.id);
        const newIndex = fields.findIndex((item) => item.id === over.id);

        return arrayMove(fields, oldIndex, newIndex);
      });
    }
  }

  const downloadHistorique = async(item)=>{
    console.log(item);
    /*const response = await fetch(`${apiUrl}/sign/downloadHistorique/${item._id}`,{
      method : 'GET',
      headers :{
        "Content-Type": "application/json",
        'Authorization' : 'Bearer ' + token
      }
    })
    if (!response.ok) {
      console.log('Erreur lors du téléchargement');
      return;
    }*/
    console.log(item.pdf_signed.replace("/upload/", "/upload/fl_attachment/"))
    const link = document.createElement("a");
    link.href = item.pdf_signed.replace("/upload/", "/upload/fl_attachment/");
    link.download = item.file_name || "document.pdf";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);    
  }
  

  return (
    <div className="parentContainer" >
      <div className="sidebar"
        style={{
          width: isOpen ? "20%" : "0",
          overflowX: "hidden",
          transition: "0.3s",
        }}
        ref={sidebarRef}
      >
            <div className="divTitle">
              <FontAwesomeIcon icon={faPencil} size="2x" />
              <h2 className="text-white titleApp">SignToky</h2>
            </div>
              <hr className="styleHr" />
            <h4 className="text-center">Details</h4>
            {Object.keys(errors).length > 0 && (
              <div className="view-error" style={{ backgroundColor: '#f04747f5', textAlign: 'center', color: 'white', padding: '5px', borderRadius: '4px' }}>
                {Object.values(errors).map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <form style={{justifyContent:'center',margin:5}}>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent :'center',
                    width: '100%', // Le conteneur prend toute la largeur disponible
                    '& .MuiTextField-root': { width: '100%' },
                  }}
                >
                  <TextField id="titre" label="titre" variant="filled" 
                  sx={{
                    backgroundColor: "#f0f0f0", // Fond gris clair
                    borderRadius: "4px", // Coins arrondis
                    input: { color: "##0e0d11bf" }, // Texte noir
                    margin : '6px'
                  }}
                  onChange={(e)=>{
                    setTitre(e.target.value)
                  }}
                  />
                  <TextField id="nom" label="nom" variant="filled" 
                  sx={{
                    backgroundColor: "#f0f0f0", // Fond gris clair
                    borderRadius: "4px", // Coins arrondis
                    input: { color: "##0e0d11bf" }, // Texte noir
                    margin : '6px'
                  }}
                  onChange={(e)=>{
                    setNom(e.target.value)
                  }}

                  />
                  <TextField id="phone" label="phone" variant="filled" 
                  sx={{
                    backgroundColor: "#f0f0f0", // Fond gris clair
                    borderRadius: "4px", // Coins arrondis
                    input: { color: "##0e0d11bf" }, // Texte noir
                    margin : '6px'
                  }}
                  onChange={(e)=>{
                    setPhone(e.target.value)
                  }}

                  />
                  <TextField id="email" label="email" variant="filled" type="email" 
                  sx={{
                    backgroundColor: "#f0f0f0", // Fond gris clair
                    borderRadius: "4px", // Coins arrondis
                    input: { color: "##0e0d11bf" }, // Texte noir
                    margin : '6px'
                  }}
                  onChange={(e)=>{
                    setEmail(e.target.value)
                  }}

                   />

                 <TextField id="adresse" label="adresse" variant="filled" 
                  sx={{
                    backgroundColor: "#f0f0f0", // Fond gris clair
                    borderRadius: "4px", // Coins arrondis
                    input: { color: "##0e0d11bf" }, // Texte noir
                    margin : '6px'
                  }}
                  onChange={(e)=>{
                    setAdresse(e.target.value)
                  }}

                  />



                </Box>
                   
              </form>
              {/*
              <SortableContext items={fields.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                {fields.map((item) => (
                <div>

                  <SortableItem key={item.id} id={item.id} item={item} />
                </div>
                ))}
              </SortableContext>
              */}
            </DndContext>
      </div>
      <div className={isOpen ? "signContainer signContainerPartial" :"signContainer signContainerFull"} ref={signContainerRef}>
      <Header headerHeight={headerHeight} setHeaderHeight={setHeaderHeight} setIsOpen={setIsOpen} isOpen={isOpen} listHistorique={listHistorique} surName={surName} downloadHistorique={downloadHistorique} />
      <Home titre={titre} phone={phone} nom={nom} email={email} adresse={adresse} setErrors={setErrors} getHistorique={getHistorique} downloadHistorique={downloadHistorique} />

      </div>

    </div>
  );
}

export default Index;
