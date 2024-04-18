import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit {
  selectedNote = false;
  disableEditing = false;
  currentDate: any;
  noteForm!: FormGroup;
  note: any = null;


  @ViewChild('titleTextarea', { static: true })
  titleTextarea!: ElementRef;
  @ViewChild('bodyTextarea', { static: true })
  bodyTextarea!: ElementRef;
  constructor(
    private notesService: NoteService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.initForm();
    this.getCurrentTimeDATE();
    this.notesService.noteClickSubscription.subscribe((note) => {
      this.note = note;
      this.bodyTextarea.nativeElement.value = this.note.body;
      this.titleTextarea.nativeElement.value = this.note.title;
      this.titleTextarea.nativeElement.focus();
    });

    this.notesService.noteSubscription.subscribe((data: any) => {
      this.bodyTextarea.nativeElement.value = '';
      this.titleTextarea.nativeElement.value = '';
      this.note = null;
    });

    this.notesService.disableEditingSubscription.subscribe((disableEditing: any) => {
      this.bodyTextarea.nativeElement.disabled = disableEditing;
      this.titleTextarea.nativeElement.disabled = disableEditing;
      
    });
  }
  // Method to initialize the Form
  initForm() {
    this.noteForm = this.formBuilder.group({
      title: [''],
      body: ['']
    });
  }

  // Function to get current Date/Time of a User
  getCurrentTimeDATE() {
    this.currentDate = new Date();
    setInterval(() => {
      this.currentDate =  new Date()
    }, 1000);
  }

  // Function to capture user input
  textInputMethod() {
          this.notesService.noteDetailSubscription.next({value:{
            body: this.bodyTextarea.nativeElement.value,
            title: this.titleTextarea.nativeElement.value
          }, 
          note: this.note
          });
  }
} 
