import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  noteClickSubscription = new Subject();
  noteDetailSubscription = new Subject();
  noteSubscription = new Subject();
  showHideSubscription = new Subject();
  noteSearchSubscription = new Subject();
  disableEditingSubscription = new Subject();

  constructor() {
   }

  noteAddEditHandler() {
    this.noteSubscription.next({action: 'addEdit'});
  }

  noteDeleteHandler() {
    this.noteSubscription.next({action: 'delete'});
  }

  noteList(value: any) {
    this.noteSubscription.next({action: 'selectNotes', enableSelectionOption: value});
  }

  noteAsPDFHandler() {
    this.noteSubscription.next({action: 'saveAsPDF'});
  }

  saveAndDownloadPDF(payload: any) {
        const doc = new jsPDF();
         // Add title
        doc.setFontSize(16);
        doc.text( payload.title, 20, 20,);
        // Add body
        doc.setFontSize(12);
        const bodyLines = doc.splitTextToSize(payload.body, 170); 
        doc.text(bodyLines, 20, 30,);
        doc.save(`${payload.date}.pdf`);
  }

  printNote(payload: any) {
    const doc = new jsPDF();
     // Add title
    doc.setFontSize(16);
    doc.text( payload.title, 20, 20,);
    // Add body
    doc.setFontSize(12);
    const bodyLines = doc.splitTextToSize(payload.body, 170); 
    doc.text(bodyLines, 20, 30,);
    setTimeout(() => {
      doc.autoPrint(); 
      window.open(doc.output('bloburl'), '_blank');
    }, 100);
}
  notePrintHandler() {
    this.noteSubscription.next({action: 'printNote'});
  }

  noteToggleHandler() {
    // this.showHideSubscription.next();
  }

  searchHandler( value: any ) {
    this.noteSearchSubscription.next({value});
  }

  // Function to set create dummy note for fresh user of the app
  setupADummyNote() {
    let notes = JSON.parse(localStorage.getItem('notes') || '{}');
    if(!notes || notes && notes.length === 0 ) {
      let currentDate =  new Date();      
      const newNote = {
        id: Math.random() * 100,
        body: '',
        title: '',
        date: currentDate,
        selected: true,
        actionEdited: false,
        updatedDate: '',
        toBeGroup: false
      };
      localStorage.setItem('notes', JSON.stringify([newNote])); 
      // this.notesList = JSON.parse(localStorage.getItem('notes') || '{}');
      this.noteClickSubscription.next(newNote);
    }
  }

  // export to pdf
  exportNotes( ) {
    const notesList = JSON.parse(localStorage.getItem("notes") || "[]");
    const csvContent = notesList.map((note: any) => `${note.id}, ${note.title},${note.body},${note.date}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'notes_list.csv');
  }
}
