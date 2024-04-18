import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'note',
    pathMatch: 'full',
  },
  {
    path: 'note',
    loadChildren: () =>
      import('./note/note.module').then((m) => m.NoteModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
