"use client"

import React, { useState, useRef } from "react"
import { Upload, FileText, X, Save, Clock, Menu, ChevronLeft, ChevronRight, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function IndexV0() {
  const [fileName, setFileName] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const [signatureHistory] = useState([
    { id: "1", fileName: "contrat-vente.pdf", date: new Date(2025, 3, 1), signedBy: "Thomas Rivière" },
    { id: "2", fileName: "accord-partenariat.pdf", date: new Date(2025, 2, 28), signedBy: "Thomas Rivière" },
    { id: "3", fileName: "facture-mars-2025.pdf", date: new Date(2025, 2, 15), signedBy: "Thomas Rivière" },
    { id: "4", fileName: "contrat-location.pdf", date: new Date(2025, 1, 20), signedBy: "Thomas Rivière" },
    { id: "5", fileName: "attestation-travail.pdf", date: new Date(2025, 0, 10), signedBy: "Thomas Rivière" },
  ])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
    }
  }

  const clearFile = () => {
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

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
      const fileType = file.name.split(".").pop()?.toLowerCase()
      if (fileType === "pdf" || fileType === "doc" || fileType === "docx") {
        setFileName(file.name)
      } else {
        alert("Format de fichier non supporté. Veuillez utiliser PDF, DOC ou DOCX.")
      }
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-teal-600 text-white">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6" />
          <h1 className="text-2xl font-serif font-bold">SignToky</h1>
        </div>
        <h2 className="text-xl font-medium mb-4">Détails</h2>
      </div>

      <div className="bg-teal-500 p-4 flex-1 space-y-4">
        <div>
          <Label htmlFor="titre" className="text-white mb-1 block">
            Titre
          </Label>
          <Input id="titre" placeholder="Titre du document" className="bg-gray-100" />
        </div>

        <div>
          <Label htmlFor="nom" className="text-white mb-1 block">
            Nom
          </Label>
          <Input id="nom" placeholder="Votre nom" className="bg-gray-100" />
        </div>

        <div>
          <Label htmlFor="phone" className="text-white mb-1 block">
            Téléphone
          </Label>
          <Input id="phone" placeholder="Votre numéro de téléphone" className="bg-gray-100" />
        </div>

        <div>
          <Label htmlFor="email" className="text-white mb-1 block">
            Email
          </Label>
          <Input id="email" type="email" placeholder="Votre email" className="bg-gray-100" />
        </div>

        <div>
          <Label htmlFor="adresse" className="text-white mb-1 block">
            Adresse
          </Label>
          <Textarea id="adresse" placeholder="Votre adresse" className="bg-gray-100 min-h-[80px]" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`hidden md:block w-80 bg-teal-500 shadow-lg transition-all duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </div>

      <button
        onClick={toggleSidebar}
        className="hidden md:flex absolute z-10 left-[320px] top-1/2 -translate-y-1/2 bg-teal-600 text-white rounded-r-md p-1 shadow-md transition-all duration-300 ease-in-out"
        style={{ left: sidebarOpen ? "320px" : "0px" }}
      >
        {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-10">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 bg-teal-500">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex-1 p-4 md:p-8 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="md:invisible">
              <Button variant="ghost" size="icon" className="text-gray-700">
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
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
                        {signatureHistory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-teal-600" />
                                {item.fileName}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell>{item.signedBy}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
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

              <Avatar className="h-10 w-10 bg-rose-400 text-white">
                <AvatarFallback>TR</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-medium mb-6">Sélectionnez le document à signer:</h2>

            <div
              className={`border-2 border-dashed ${isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300"} rounded-lg p-8 mb-6 text-center transition-colors duration-200`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {fileName ? (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600" />
                    <span className="font-medium">{fileName}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 mb-4">Glissez-déposez votre fichier ici ou</p>
                  <Button className="relative bg-teal-600 hover:bg-teal-700">
                    Parcourir...
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">Formats acceptés: PDF, DOC, DOCX</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
