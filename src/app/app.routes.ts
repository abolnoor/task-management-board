import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';
import { TaskBoardComponent } from './features/task-board/task-board.component';

export const routes: Routes = [
  { path: 'task-board', component: TaskBoardComponent },
  { path: '',   redirectTo: '/task-board', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
