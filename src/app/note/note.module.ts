import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateNoteComponent } from './components/create-note/create-note.component';
import { NoteListComponent } from './components/note-list/note-list.component';
import { OverviewComponent } from './components/overview/overview.component';
import { NoteRoutingModule } from './note-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
@NgModule({
  declarations: [
    CreateNoteComponent,
    NoteListComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    NoteRoutingModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ]
})
export class NoteModule { }
