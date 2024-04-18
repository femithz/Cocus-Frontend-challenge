import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/note/services/note.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  selectedNote = false;
  noteWithImage = false;
  disableEditing = false;
  enableSelectionOption = false;
  
  constructor(private notesService: NoteService) { }
  
  ngOnInit() {
    this.notesService.noteClickSubscription.subscribe((data: any) => {
      this.selectedNote = true;
    });
  }
  // Function to create new note
  addEditNoteHandler() {
    this.notesService.noteAddEditHandler();
    this.notesService.setupADummyNote();
    this.selectedNote = true;
  }
  // Function to create new note
  addEditNoteImageHandler(fileInput: HTMLInputElement) {
      fileInput.click();
  }
  // Function to select the file
  onFileSelected(event: any) {
            const file: File = event.target.files[0];
            if (file) {
              this.noteWithImage = true;
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                const imageBase64 = reader.result as string;
                localStorage.setItem('uploadedImage', imageBase64);
              };
            }
  }
  // Function to delete selected note
  deleteNoteHandler() {
    this.notesService.noteDeleteHandler();
  }
  // Function to search
  searchHandler(inputEl: any) {
    this.notesService.searchHandler(inputEl.value);
  }
  // Function to enable and disable
  disableEditingHandler(){
    this.disableEditing = !this.disableEditing;
    this.notesService.disableEditingSubscription.next({'disableEditing': this.disableEditing});
  }
  // Function that export notes
  exportHandler() {
    this.notesService.exportNotes();
  }
  // Function to save selected note as pdf
  savePdfHandler() {
    this.notesService.noteAsPDFHandler();
  }
 // Function to send the selected note to the connected printer
 printNoteHandler() {
  this.notesService.notePrintHandler();
 } 
//  Function to select notes
selectNotesHandler() {
  this.enableSelectionOption = !this.enableSelectionOption
  this.notesService.noteList({'enableSelectionOption': this.enableSelectionOption})
}
}
