import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { pdfjs } from "react-pdf";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PDFDocument, rgb } from "pdf-lib";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, X, Save, Clock, Menu, ChevronLeft, ChevronRight,Calendar,Download } from 'lucide-react'

  

function Home({titre,phone,nom,email,adresse,setErrors,getHistorique}) {
    const [fileName, setFileName] = useState(null)
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
    const [showPdf, setShowPdf] = useState(false);
    const signCanvas = useRef(null);
    const pdfContainerRef = useRef(null);
    const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [signaturePage, setSignaturePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token= localStorage.getItem('token');
    const [isDragging, setIsDragging] = useState(false)
    const [disableSign, setDisableSign] = useState(false)
    
    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

    }, []);

    useEffect(()=>{

        const storedId = localStorage.getItem("anon_id");
        const expiresAt = localStorage.getItem("anon_id_expires");
        const isLogin = localStorage.getItem("token");

        if(!isLogin){
            if ( storedId && expiresAt && new Date() < new Date(expiresAt)) {
                setDisableSign(true);
                console.log("ID valide :", storedId);
            }
            else{
                setDisableSign(true);
            }
        }
        else{
            setDisableSign(false)
        }
    },[60000])

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setFileName(e.target.files[0].name)
        }
      }

    // Gestionnaires d'événements pour le glisser-déposer
    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }
    
    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }
    
    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }
    
    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]
        // Vérifier si le fichier est un PDF, DOC ou DOCX
        const fileType = file.name.split('.').pop()?.toLowerCase()
        if (fileType === 'pdf' || fileType === 'doc' || fileType === 'docx') {
            setFileName(file.name)
            handlePdfUpload(file);
            //setShowPdf(true);
        } else {
            alert("Format de fichier non supporté. Veuillez utiliser PDF, DOC ou DOCX.")
        }
        }
    }


    const clearFile = () => {
        setFileName(null)
      }
    const saveSignedPdf = async () => {
        if (!pdfFile || !signCanvas.current) {
            alert("Veuillez charger un PDF et ajouter une signature !");
            return;
        }
    
        // 📌 Récupérer l'image de la signature
        const signatureDataUrl = signCanvas.current.toDataURL("image/png");
        const signatureImageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());
    
        // 📌 Charger le PDF existant
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const getPage = pdfDoc.getPages()[signaturePage - 1];
    
        // 📌 Intégrer l'image de signature dans le PDF
        const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
        const { width, height } = getPage.getSize();
    
        // 📌 Ajuster la position en tenant compte de l'échelle du PDF
        const scaleFactor = 1.5; // Facteur de zoom utilisé par le `Viewer`
        const adjustedX = signaturePosition.x / scaleFactor;
        const adjustedY = height - (signaturePosition.y / scaleFactor) - 100; 
    
        getPage.drawImage(signatureImage, {
            x: adjustedX,
            y: adjustedY,
            width: 200 / scaleFactor,
            height: 100 / scaleFactor
        });
    
        // 📌 Sauvegarder le PDF modifié
        const newPdfBytes = await pdfDoc.save();
        const blob = new Blob([newPdfBytes], { type: "application/pdf" });
    
        // 📌 Télécharger le PDF signé
        /*const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "document_signe.pdf";
        link.click();
        */
        await uploadSignedPdf(blob,pdfFile)

    };


    const validateForm = () => {
        let newErrors = {};

        if (!titre.trim()) newErrors.titre = "Le titre est requis.";
        if (!nom.trim()) newErrors.nom = "Le nom est requis.";
        if (!email.trim()) {
            newErrors.email = "L'email est requis.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "L'email n'est pas valide.";
        }
        if (!adresse.trim()) newErrors.adresse = "L'adresse est requise.";
        if (!phone.trim()) newErrors.phone = "Le numéro de téléphone est requis.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const uploadSignedPdf = async (blob,pdfFile) => {
        if(!validateForm()) return;
        const formData = new FormData();
        formData.append("file_new", blob, "document_signe.pdf");
        formData.append("file_original", pdfFile, "document_original.pdf");
        formData.append("file_name", fileName);
        formData.append("titre", titre);
        formData.append("nom", nom);
        formData.append("email", email);
        formData.append("adresse", adresse);
        formData.append("phone", phone);
        const apiUrl = import.meta.env.VITE_API_URL;
    
        try {
            const response = await fetch(`${apiUrl}/sign/add`, {
                method: "POST",
                headers: {
                    //"Content-Type": "application/json",
                    'Authorization' : 'Bearer ' + token
                },
                body: formData
            });
    
            if (response.ok) {
                console.log(response);
                alert("PDF signé sauvegardé avec succès !");
               const isLogin = localStorage.getItem("token");

                if(!isLogin){
    
                        //stocke dans une session pour les utilisateurs non connectes
                        const anonId = crypto.randomUUID();
                        const expiresAt = new Date();
                        expiresAt.setDate(expiresAt.getDate() + 1); // +1 jour
                        localStorage.setItem("anon_id", crypto.randomUUID());
                        localStorage.setItem("anon_id", anonId);
                        localStorage.setItem("anon_id_expires", expiresAt.toISOString());
                        setDisableSign(true);
                    
                }
            } else {
                alert("Erreur lors de l'enregistrement du PDF.");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier :", error);
        }
        setShowPdf(false);
        clearFile()

        getHistorique();
    };

    // 📌 Début du déplacement en cliquant sur la poignée
    const handleMouseDown = (event) => {
        event.preventDefault();
        const rect = pdfContainerRef.current.getBoundingClientRect();
    
        setDragging(true);
        setOffset({
            x: event.clientX - rect.left - signaturePosition.x,
            y: event.clientY - rect.top - signaturePosition.y
        });    
    };

    // 📌 Déplacement de la signature
    const handleMouseMove = (event) => {
        if (!dragging) return;

        const rect = pdfContainerRef.current.getBoundingClientRect();
        let x = event.clientX - rect.left - offset.x;
        let y = event.clientY - rect.top - offset.y;
    
        // Empêcher la sortie des limites du PDF
        x = Math.max(0, Math.min(rect.width - 200, x)); 
        y = Math.max(0, Math.min(rect.height - 100, y));
    
        setSignaturePosition({ x, y });    };

    // 📌 Arrêter le déplacement
    const handleMouseUp = () => {
        setDragging(false);

        if (pdfContainerRef.current){
            const pageHeight = pdfContainerRef.current.scrollHeight / totalPages;
            const estimatedPage = Math.min(Math.max(1, Math.ceil(signaturePosition.y / pageHeight)), totalPages);
            setSignaturePage(estimatedPage);
        }
    };

    // 📌 Gestion du téléchargement du PDF
    const handlePdfUpload = async (file) => {
        //const file = e.target.files[0];
        if (file) {
            setFileName(file.name)
            setPdfFile(file);
            setPdfPreviewUrl(URL.createObjectURL(file));
            setShowPdf(true);

            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            setTotalPages(pdfDoc.getPageCount())

        }
    };

    // 📌 Effacer la signature
    const handleClearSignature = () => {
        signCanvas.current.clear();
    };

    return (
    <>
        <div className="bg-white uploadFile">
            <h2 className="text-xl font-medium mb-6">Sélectionnez le document à signer:</h2>

            <div 
            >
                {fileName ? (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-teal-600" />
                        <span className="font-medium">{fileName}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={()=>{
                        setShowPdf(false);
                        clearFile()
                        }} >
                        <X className="h-4 w-4" />
                    </Button>
                    </div>
                ) : (
                    <div
                    className={`border-2 border-dashed ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300'} rounded-lg p-8 mb-6 text-center transition-colors duration-200
                    ${
                        disableSign ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''
                      }
                    `}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
       
                    >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 mb-4">Glissez-déposez votre fichier ici ou</p>
                    <Button className="relative bg-teal-600 hover:bg-teal-700">
                        Parcourir...
                        <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const fileType = file.name.split('.').pop()?.toLowerCase();
                                if (['pdf', 'doc', 'docx'].includes(fileType)) {
                                    handlePdfUpload(file);
                                } else {
                                    alert("Format non supporté.");
                                }
                            }
                        }}
                        accept=".pdf"
                        />
                    </Button>
                    <p className="text-sm text-gray-400 mt-2">Formats acceptés: PDF, DOC, DOCX</p>
                    </div>
                )}
                </div>
                
            </div>


<div className="blockSignature" style={{ textAlign: "center", padding: "5px",flex :1 }} 
onMouseMove={handleMouseMove} 
onMouseUp={handleMouseUp}>
<div className={`row mb-3 `} style={{textAlign:'left',alignItems:'center'}}>
    {/*<label  className="col-6 my-2" style={{fontSize :'20px'}} ><b>Selectionnez le document à signer:</b></label>
    <br />
    <div className="col-8">
        <input type="file" id="fileSign" className="form-control" style={{marginLeft:'15%'}} accept="application/pdf" onChange={handlePdfUpload} />
    </div>*/}
        
        </div>

            {showPdf && pdfPreviewUrl ? (
                <div ref={pdfContainerRef}
                    style={{ 
                        width: "100%", 
                        maxWidth: "800px", 
                        position: "relative",
                        cursor: "crosshair",
                        margin: "auto",
                        border: "1px solid gray", 
                        padding: "10px",
                        overflow: "auto"
                    }}>
                    {/* 🎯 Affichage du PDF */}
                    <div style={{ border: "1px solid gray", padding: "10px" }}>
                        <Viewer fileUrl={pdfPreviewUrl} defaultScale={1.5} />
                    </div>

                    {/* 🔹 Signature Positionnable avec Poignée */}
                    {showPdf && (
                        <div 
                            style={{ 
                                position: "absolute", 
                                left: `${signaturePosition.x}px`, 
                                top: `${signaturePosition.y}px`,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                        >
                            {/* 🔵 Poignée de déplacement */}
                            <div 
                                onMouseDown={handleMouseDown}
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: "red",
                                    borderRadius: "50%",
                                    cursor: dragging ? "grabbing" : "grab",
                                    marginBottom: "5px",
                                    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)"
                                }}
                            ></div>

                            {/* 🖊 Zone de signature */}
                            <div 
                            style={{
                                border: "2px dashed red",
                                backgroundColor:'white',
                                opacity : 0.9
                            }}
                            >

                            <SignatureCanvas 
                                ref={signCanvas} 
                                canvasProps={{ width: 200, height: 100, className: "sigCanvas" ,backgroundColor:'blue' }} 
                            
                                />
                                </div>
                        </div>
                    )}
                </div>
            ):(
                <>
                <h2 className="text-xl font-medium mb-4">Aperçu du document</h2>
                <Separator className="mb-4" />
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  {fileName ? (
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Aperçu du document: {fileName}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400">Aucun document sélectionné</p>
                  )}
                </div>
                </>
    
            )}

            {/* 📌 Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button variant="outline" className="border-rose-300 text-rose-500 hover:bg-rose-50"
                disabled={!showPdf}
                onClick={handleClearSignature}
              >
                <X className="h-4 w-4 mr-2" />
                Effacer Signature
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700"
                onClick={saveSignedPdf}
                disabled={!showPdf}
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder PDF signé
              </Button>
            </div>

        </div>

    </>
        
    );
}

export default Home;
