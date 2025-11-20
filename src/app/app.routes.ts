import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { UploadComponent } from './components/upload/upload.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HistoryComponent } from './components/history/history.component';

export const routes: Routes = [
    { path: '', redirectTo: 'chat', pathMatch: 'full' },

    { path: 'chat', component: ChatComponent },
    { path: 'upload', component: UploadComponent },
    { path: 'history', component: HistoryComponent },

    { path: '**', component: NotFoundComponent }
];
