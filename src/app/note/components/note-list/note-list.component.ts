import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { jsPDF } from "jspdf";
@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
  notesList: {
    body: String,
    date: any,
    id: any,
    selected: any,
    title: String
    actionEdited: any,
    updatedDate: any,
    toBeGroup: any
  }[]  = [];

  filteredNotes: any = [];
  selectedNotes: any = [];
  favouritesNotesList:  {
    body: String,
    date: any,
    id: any,
    selected: any,
    title: String
    actionEdited: any,
    updatedDate: any,
    toBeGroup: any
  }[]  = [];
  selectedNote : any = null;

  searchedText = '';
  onFavourites = false;

  constructor(
    private notesService: NoteService,
    private encryptionService: EncryptionService
  ) {
   }

  ngOnInit() {
    this.notesList = JSON.parse(localStorage.getItem("notes") || "[]");
    this.favouritesNotesList = JSON.parse(localStorage.getItem("selectedNotes") || "[]");
    if(this.favouritesNotesList.length !== 0) {
      this.onFavourites = true;
    }
    this.filteredNotes = this.notesList;
    this.notesService.noteSearchSubscription.subscribe((value: any) => {
      this.filteredNotes = this.searchedThroughNotes(value);
    });
    this.notesService.noteDetailSubscription.subscribe((data: any) => {
      if ( data.note ) {
        const noteIndex = this.notesList.findIndex((note: any) => note.id === data.note.id);
        let currentDate = new Date(); 
        this.notesList[noteIndex]['body'] = data.value.body;
        this.notesList[noteIndex]['title'] = data.value.title;
        this.notesList[noteIndex]['updatedDate'] = currentDate;
        this.notesList[noteIndex]['actionEdited'] = true;
      } else {
        this.notesList[0].body = data.value.body;
        this.notesList[0].title = data.value.title;
      }
      localStorage.setItem('notes', JSON.stringify(this.notesList));
    });

    this.notesService.noteSubscription.subscribe((data: any) => {
      if ( data.action === 'delete' && this.selectedNote ) {
        
          this.notesList.splice(this.getSelectedNoteIndex(), 1);
          if(this.notesList.length === 0){
            // this.setDummyNote();
          }
          if(this.onFavourites) {
            this.favouritesNotesList.splice(this.getSelectedFavouriteNoteIndex(), 1);
            if(this.favouritesNotesList.length === 0){
              // this.setDummyNote();
            }
          }
      }
      if(data.action === 'saveAsPDF' && this.selectedNote  ) {
        this.selectedNote = this.notesList[this.getSelectedNoteIndex()];
        this.notesService.saveAndDownloadPDF(this.selectedNote);
      }
      if(data.action === 'printNote' && this.selectedNote) {
        this.selectedNote = this.notesList[this.getSelectedNoteIndex()];
        this.notesService.printNote(this.selectedNote);
      }
      if ( data.action === 'addEdit' ) {
        let currentDate = new Date();    
        this.notesList.forEach((note: any) => note.selected = false);
        this.notesList.unshift({
          id: Math.random() * 100,
          body: '',
          title: '',
          date: currentDate,
          selected: true,
          actionEdited: false,
          updatedDate: '',
          toBeGroup: false
        });
        this.noteClickHandler(this.notesList[0]);
      }
      if(data.action === 'selectNotes' ) {
          this.notesList = this.notesList.map((note: any) => ({ ...note, toBeGroup: data.enableSelectionOption.enableSelectionOption }));
      }
      localStorage.setItem('notes', JSON.stringify(this.notesList));
      if(this.onFavourites) {
        localStorage.setItem('selectedNotes', JSON.stringify(this.favouritesNotesList));
      }
    });
  }


  // Function to search through user list of notes
  searchedThroughNotes(value: any) { 
    if( value || (typeof value.value === 'string' && value.length === 0) ){
       this.searchedText = value.value; 
    }
    if( this.notesList && this.notesList.length > 0 ){
      return this.notesList.filter((note: any) => {
        if( this.searchedText.trim().length === 0 ||  note.title.indexOf(this.searchedText.trim()) > -1 || 
          note.body.indexOf(this.searchedText.trim()) > -1 ){
          return true;
        } else {
          return false;
        }
    });
    } else {
      return [];
    }
  }

  // Function to search through favourite list of notes
  searchedThroughFavouriteNotes(value: any) {
    if( value || (typeof value.value === 'string' && value.length === 0) ){
      this.searchedText = value.value; 
   }
   if( this.favouritesNotesList && this.favouritesNotesList.length > 0 ){
     return this.favouritesNotesList.filter((note: any) => {
       if( this.searchedText.trim().length === 0 ||  note.title.indexOf(this.searchedText.trim()) > -1 || 
         note.body.indexOf(this.searchedText.trim()) > -1 ){
         return true;
       } else {
         return false;
       }
   });
   } else {
     return [];
   }
  }


  getSelectedNoteIndex() {
    const index = this.notesList.findIndex( (note: any ) => note.selected === true );
    this.selectedNote = this.notesList[index];
    return index;
  }

  getSelectedFavouriteNoteIndex() {
    const index = this.favouritesNotesList.findIndex( (note: any ) => note.selected === true );
    this.selectedNote = this.favouritesNotesList[index];
    return index;
  }

  removeSelection() {
    this.notesList.forEach((note: any )  => note.selected = false);
  }

  noteClickHandler(data: any) {
    if(!this.onFavourites) {
    const index = this.notesList.findIndex((note: any )  => note.id === data.id );
    this.selectedNote = this.notesList[index];
    this.notesList.forEach((note: any ) => note.selected = false);
    this.notesList[index].selected = true;
    this.notesService.noteClickSubscription.next(this.notesList[index]);
    }
    if(this.onFavourites) {
      const index = this.favouritesNotesList.findIndex((note: any )  => note.id === data.id );
      this.selectedNote = this.favouritesNotesList[index];
      this.favouritesNotesList.forEach((note: any ) => note.selected = false);
      this.favouritesNotesList[index].selected = true;
      this.notesService.noteClickSubscription.next(this.favouritesNotesList[index]);
      }
  }

  // Function to group notes about to be moved to favorurites notes
  pushSelectedToFavorite(note: any, event: any) {
    if (event.target.checked) {
      this.selectedNotes.push(note);
    } else {
      const index = this.selectedNotes.findIndex((item: any) => item.title === note.title);
      if (index !== -1) {
        this.selectedNotes.splice(index, 1);
        console.log(this.selectedNotes);
      }
    }
  }

  // Function to move all selected notes to favourites group
  moveToFavourite() {
    this.notesList = this.notesList.filter((note: any) => !this.selectedNotes.includes(note));
    localStorage.setItem('notes', JSON.stringify(this.notesList));
    localStorage.setItem('selectedNotes', JSON.stringify(this.selectedNotes));
  }
  // Function to view favourites
  viewFavourites() {
    // this.notesList = this.favouritesNotesList;
    this.favouritesNotesList = JSON.parse(localStorage.getItem("selectedNotes") || "[]");
    this.onFavourites = true;
  }
  // Function to view all notes
  viewAllNotes(){
    this.onFavourites = false;
  }
}
